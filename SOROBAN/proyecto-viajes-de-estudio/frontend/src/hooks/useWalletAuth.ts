'use client';

import { useState, useCallback, useEffect } from 'react';
import StellarSDK from '@stellar/js-sdk';

export interface WalletSession {
  address: string;
  balance: string;
  isConnected: boolean;
  network: string;
}

export interface TransactionRecord {
  id: string;
  hash: string;
  trip: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  explorerUrl?: string;
}

export const useWalletAuth = () => {
  const [wallet, setWallet] = useState<WalletSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freighterReady, setFreighterReady] = useState(false);

  // Configuración Stellar Testnet
  const server = new StellarSDK.Horizon.Server('https://horizon-testnet.stellar.org');
  const networkPassphrase = StellarSDK.Networks.TESTNET_NETWORK_PASSPHRASE;

  // Detectar Freighter disponible
  useEffect(() => {
    const checkFreighter = async () => {
      if (typeof window === 'undefined') return;

      for (let i = 0; i < 15; i++) {
        if ((window as any).freighter) {
          setFreighterReady(true);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      setFreighterReady(false);
    };

    checkFreighter();
  }, []);

  // Conectar con Freighter
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === 'undefined') {
        throw new Error('Cliente-side solo');
      }

      if (!(window as any).freighter) {
        throw new Error('Freighter Wallet no está instalada. Descargala desde freighter.app');
      }

      // Obtener clave pública
      const publicKey = await (window as any).freighter.getPublicKey();
      if (!publicKey) throw new Error('No se pudo obtener la clave pública');

      // Obtener saldo de Horizon
      const account = await server.loadAccount(publicKey);
      const balance = account.balances
        .find((b: any) => b.asset_type === 'native')
        ?.balance || '0';

      const session: WalletSession = {
        address: publicKey,
        balance,
        isConnected: true,
        network: 'Stellar Testnet',
      };

      setWallet(session);
      localStorage.setItem('wallet_session', JSON.stringify(session));

      return session;
    } catch (err: any) {
      const message = err.message || 'Error conectando wallet';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pagar por viaje
  const payForTrip = useCallback(
    async (tripName: string, amountXLM: string, destinationAddress: string) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!wallet?.address) {
          throw new Error('Wallet no conectada');
        }

        // Cargar cuenta
        const account = await server.loadAccount(wallet.address);

        // Crear transacción
        const transaction = new StellarSDK.TransactionBuilder(account, {
          fee: StellarSDK.BASE_FEE,
          networkPassphrase,
        })
          .addMemo(StellarSDK.Memo.text(`Viaje: ${tripName}`))
          .addOperation(
            StellarSDK.Operation.payment({
              destination: destinationAddress,
              asset: StellarSDK.Asset.native(),
              amount: amountXLM,
            })
          )
          .setTimeout(300)
          .build();

        // Firmar con Freighter
        if (!(window as any).freighter) {
          throw new Error('Freighter no disponible');
        }

        const signed = await (window as any).freighter.signTransaction(
          transaction.toEnvelope().toXDR(),
          networkPassphrase
        );

        // Enviar a Testnet
        const envelope = StellarSDK.TransactionEnvelope.fromXDR(
          signed,
          networkPassphrase
        );
        const result = await server.submitTransaction(envelope);

        // Guardar en localStorage
        const txRecord: TransactionRecord = {
          id: `tx_${Date.now()}`,
          hash: result.hash,
          trip: tripName,
          amount: amountXLM,
          timestamp: Date.now(),
          status: 'completed',
          explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
        };

        const history = JSON.parse(localStorage.getItem('tx_history') || '[]');
        history.push(txRecord);
        localStorage.setItem('tx_history', JSON.stringify(history));

        // Actualizar balance
        const updated = await server.loadAccount(wallet.address);
        const newBalance = updated.balances
          .find((b: any) => b.asset_type === 'native')
          ?.balance || '0';

        setWallet({ ...wallet, balance: newBalance });
        localStorage.setItem('wallet_session', JSON.stringify({ ...wallet, balance: newBalance }));

        return txRecord;
      } catch (err: any) {
        const message = err.message || 'Error en transacción';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [wallet]
  );

  // Obtener historial
  const getTransactionHistory = useCallback((): TransactionRecord[] => {
    if (typeof window === 'undefined') return [];
    const history = localStorage.getItem('tx_history');
    return history ? JSON.parse(history) : [];
  }, []);

  // Desconectar
  const disconnect = useCallback(() => {
    setWallet(null);
    localStorage.removeItem('wallet_session');
    setError(null);
  }, []);

  // Cargar sesión guardada al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('wallet_session');
    if (saved) {
      try {
        setWallet(JSON.parse(saved));
      } catch {
        localStorage.removeItem('wallet_session');
      }
    }
  }, []);

  return {
    wallet,
    isLoading,
    error,
    freighterReady,
    connectWallet,
    payForTrip,
    getTransactionHistory,
    disconnect,
  };
};
