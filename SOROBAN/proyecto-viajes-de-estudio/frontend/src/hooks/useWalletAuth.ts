/**
 * useWalletAuth.ts
 * Hook for wallet authentication and payment
 */

'use client';

import { useState, useCallback } from 'react';

export interface WalletConnection {
  address: string;
  walletType: WalletType;
  isConnected: boolean;
  balance?: string;
  network?: string;
}

export type WalletType = 
  | 'metamask' 
  | 'stellar' 
  | 'ledger' 
  | 'mercadopago' 
  | 'coinbase'
  | 'walletconnect';

export const useWalletAuth = () => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Conectar Metamask
  const connectMetamask = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask no está instalado');
      }

      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      const network = await (window as any).ethereum.request({
        method: 'eth_chainId',
      });

      setWallet({
        address,
        walletType: 'metamask',
        isConnected: true,
        network,
      });

      return { address, walletType: 'metamask' };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar Stellar
  const connectStellar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !(window as any).stellar) {
        throw new Error('Stellar Wallet no está instalado');
      }

      const result = await (window as any).stellar.getPublicKey();
      
      setWallet({
        address: result,
        walletType: 'stellar',
        isConnected: true,
        network: 'Stellar',
      });

      return { address: result, walletType: 'stellar' };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar Coinbase Wallet
  const connectCoinbase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window === 'undefined' || !(window as any).coinbaseWalletExtension) {
        throw new Error('Coinbase Wallet no está instalado');
      }

      const accounts = await (window as any).coinbaseWalletExtension.request({
        method: 'eth_requestAccounts',
      });

      setWallet({
        address: accounts[0],
        walletType: 'coinbase',
        isConnected: true,
      });

      return { address: accounts[0], walletType: 'coinbase' };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar Ledger
  const connectLedger = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simular conexión con Ledger
      const address = '0x' + Math.random().toString(16).slice(2);
      
      setWallet({
        address,
        walletType: 'ledger',
        isConnected: true,
      });

      return { address, walletType: 'ledger' };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar Mercado Pago
  const connectMercadoPago = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Redirigir a OAuth de Mercado Pago
      const clientId = process.env.NEXT_PUBLIC_MERCADO_PAGO_CLIENT_ID;
      if (!clientId) {
        throw new Error('Mercado Pago no está configurado');
      }

      const redirectUri = `${window.location.origin}/auth/mercadopago/callback`;
      const authUrl = `https://auth.mercadopago.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      
      window.location.href = authUrl;
      return { address: 'mercadopago_user', walletType: 'mercadopago' };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Desconectar wallet
  const disconnect = useCallback(() => {
    setWallet(null);
    setError(null);
  }, []);

  return {
    wallet,
    isLoading,
    error,
    connectMetamask,
    connectStellar,
    connectCoinbase,
    connectLedger,
    connectMercadoPago,
    disconnect,
  };
};
