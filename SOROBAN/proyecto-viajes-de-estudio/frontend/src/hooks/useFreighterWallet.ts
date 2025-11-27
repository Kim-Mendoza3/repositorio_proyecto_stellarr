'use client';

import { useState, useCallback, useEffect } from 'react';
import * as StellarSDK from '@stellar/stellar-sdk';

export interface WalletAccount {
  publicKey: string;
  balance: number;
  network: string;
}

export interface PendingTransaction {
  id: string;
  tripName: string;
  amount: number;
  status: 'pending' | 'submitted' | 'success' | 'failed';
  hash?: string;
  timestamp: string;
  error?: string;
}

const TESTNET_SERVER = new StellarSDK.Horizon.Server(
  'https://horizon-testnet.stellar.org'
);

const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Dirección de la operadora de viajes (donde llegan los pagos)
const TRIPS_OPERATOR_ADDRESS = 'GBUQWP3BOUZX34LOCALQVFSGHFTOJREM23NRHBK264KEXWFNVLB74OOO';

export const useFreighterWallet = () => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [freighterAvailable, setFreighterAvailable] = useState(false);

  // Verificar disponibilidad de Freighter
  useEffect(() => {
    const checkFreighter = async () => {
      if (typeof window === 'undefined') return;

      for (let i = 0; i < 10; i++) {
        const freighter = (window as any).freighter;
        if (freighter) {
          console.log('✅ Freighter detectado');
          setFreighterAvailable(true);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      console.log('❌ Freighter no detectado');
    };

    checkFreighter();
  }, []);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    if (!freighterAvailable) {
      throw new Error('Freighter no está instalada. Descárgala desde https://freighter.app');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const freighter = (window as any).freighter;

      // Solicitar acceso
      const allowed = await freighter.isAllowed();
      if (!allowed) {
        await freighter.requestAccess();
      }

      // Obtener clave pública
      const publicKey = await freighter.getPublicKey();
      console.log('Wallet conectada:', publicKey);

      // Obtener información de la cuenta en Testnet
      const response = await TESTNET_SERVER.accounts().accountId(publicKey).call();
      const balance = parseFloat(
        response.balances.find((b: any) => b.asset_type === 'native')?.balance || '0'
      );

      const walletData: WalletAccount = {
        publicKey,
        balance,
        network: 'Stellar Testnet',
      };

      setAccount(walletData);
      localStorage.setItem('wallet_account', JSON.stringify(walletData));
      localStorage.setItem('wallet_public_key', publicKey);

      return walletData;
    } catch (err: any) {
      const message = err.message || 'Error conectando wallet';
      setError(message);
      console.error('Error:', message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [freighterAvailable]);

  // Desconectar wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setTransactions([]);
    setError(null);
    localStorage.removeItem('wallet_account');
    localStorage.removeItem('wallet_public_key');
  }, []);

  // Procesar pago de viaje
  const buyTrip = useCallback(
    async (trip: { id: string; name: string; priceXLM: number }) => {
      if (!account) {
        throw new Error('Wallet no conectada');
      }

      if (account.balance < trip.priceXLM) {
        throw new Error(`Saldo insuficiente. Necesitas ${trip.priceXLM} XLM`);
      }

      const txId = `trip_${Date.now()}`;
      const pendingTx: PendingTransaction = {
        id: txId,
        tripName: trip.name,
        amount: trip.priceXLM,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      setTransactions(prev => [pendingTx, ...prev]);

      try {
        const freighter = (window as any).freighter;

        // Obtener cuenta actual
        const sourceAccount = await TESTNET_SERVER.loadAccount(account.publicKey);

        // Construir transacción
        const transaction = new StellarSDK.TransactionBuilder(sourceAccount, {
          fee: StellarSDK.BASE_FEE,
          networkPassphrase: NETWORK_PASSPHRASE,
        })
          .addMemo(StellarSDK.Memo.text(`Viaje: ${trip.name}`))
          .addOperation(
            StellarSDK.Operation.payment({
              destination: TRIPS_OPERATOR_ADDRESS,
              asset: StellarSDK.Asset.native(),
              amount: trip.priceXLM.toString(),
            })
          )
          .setTimeout(300) // 5 minutos timeout
          .build();

        // Firmar con Freighter
        const signedXdr = await freighter.signTransaction(transaction.toXDR(), {
          network: NETWORK_PASSPHRASE,
        });

        const signedTx = StellarSDK.TransactionBuilder.fromXDR(
          signedXdr,
          NETWORK_PASSPHRASE
        );

        // Actualizar estado a submitted
        setTransactions(prev =>
          prev.map(tx =>
            tx.id === txId ? { ...tx, status: 'submitted' } : tx
          )
        );

        // Enviar a la red
        const result = await TESTNET_SERVER.submitTransaction(signedTx);
        console.log('✅ Transacción enviada:', result);

        // Actualizar estado a success
        setTransactions(prev =>
          prev.map(tx =>
            tx.id === txId
              ? {
                  ...tx,
                  status: 'success',
                  hash: result.hash,
                }
              : tx
          )
        );

        // Actualizar saldo
        const updatedAccount = await TESTNET_SERVER.loadAccount(account.publicKey);
        const newBalance = parseFloat(
          updatedAccount.balances.find((b: any) => b.asset_type === 'native')?.balance || '0'
        );

        setAccount(prev => prev ? { ...prev, balance: newBalance } : null);

        return {
          success: true,
          hash: result.hash,
          explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
        };
      } catch (err: any) {
        const errorMsg = err.message || 'Error procesando pago';
        setTransactions(prev =>
          prev.map(tx =>
            tx.id === txId
              ? {
                  ...tx,
                  status: 'failed',
                  error: errorMsg,
                }
              : tx
          )
        );
        throw err;
      }
    },
    [account]
  );

  // Cargar datos guardados
  const loadSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem('wallet_account');
      if (saved) {
        setAccount(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  }, []);

  // Obtener historial de transacciones de Testnet
  const fetchTransactionHistory = useCallback(async () => {
    if (!account) return [];

    try {
      const response = await TESTNET_SERVER.transactions()
        .forAccount(account.publicKey)
        .order('desc')
        .limit(10)
        .call();

      return response.records || [];
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    }
  }, [account]);

  return {
    account,
    isConnecting,
    error,
    transactions,
    freighterAvailable,
    connectWallet,
    disconnectWallet,
    buyTrip,
    loadSavedData,
    fetchTransactionHistory,
  };
};

export default useFreighterWallet;
