/**
 * WalletSelector Component
 * Allow users to connect with different wallet providers
 */

'use client';

import React, { useState } from 'react';
import { useWalletAuth, WalletType } from '@/hooks/useWalletAuth';
import Link from 'next/link';

interface WalletSelectorProps {
  onConnect?: (address: string, walletType: WalletType) => void;
  showPasskey?: boolean;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({ 
  onConnect,
  showPasskey = true 
}) => {
  const { 
    wallet, 
    isLoading, 
    error, 
    connectMetamask, 
    connectStellar, 
    connectCoinbase, 
    connectLedger, 
    connectMercadoPago,
    disconnect 
  } = useWalletAuth();

  const [selectedTab, setSelectedTab] = useState<'wallet' | 'passkey'>('wallet');

  const handleWalletConnect = async (connectFn: () => Promise<any>) => {
    try {
      const result = await connectFn();
      onConnect?.(result.address, result.walletType);
    } catch (err) {
      console.error('Error conectando wallet:', err);
    }
  };

  if (wallet && wallet.isConnected) {
    return (
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-400/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-white">Conectado</h3>
          </div>
          <span className="text-xs bg-green-500/30 text-green-200 px-3 py-1 rounded-full font-semibold">
            {wallet.walletType.toUpperCase()}
          </span>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
          <p className="text-xs text-gray-300 mb-1">Dirección de Wallet:</p>
          <p className="text-white font-mono text-sm break-all">{wallet.address}</p>
        </div>

        {wallet.network && (
          <div className="text-xs text-gray-300 mb-4">
            Red: <span className="text-white font-semibold">{wallet.network}</span>
          </div>
        )}

        <button
          onClick={disconnect}
          className="w-full bg-red-500/80 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {showPasskey && (
        <div className="flex gap-2 bg-white/10 p-1 rounded-lg border border-white/20">
          <button
            onClick={() => setSelectedTab('wallet')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              selectedTab === 'wallet'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            💳 Wallet
          </button>
          <button
            onClick={() => setSelectedTab('passkey')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              selectedTab === 'passkey'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🔐 Passkey
          </button>
        </div>
      )}

      {/* Wallet Section */}
      {selectedTab === 'wallet' && (
        <div className="space-y-3">
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4">
              <p className="text-red-200 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Stellar */}
          <button
            onClick={() => handleWalletConnect(connectStellar)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div className="text-left">
                  <p className="font-bold text-white">Stellar Wallet</p>
                  <p className="text-xs text-indigo-200">Red Stellar</p>
                </div>
              </div>
              {isLoading && <div className="animate-spin">⏳</div>}
            </div>
          </button>

          {/* MetaMask */}
          <button
            onClick={() => handleWalletConnect(connectMetamask)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦊</span>
                <div className="text-left">
                  <p className="font-bold text-white">MetaMask</p>
                  <p className="text-xs text-orange-200">Ethereum, Polygon, etc.</p>
                </div>
              </div>
              {isLoading && <div className="animate-spin">⏳</div>}
            </div>
          </button>

          {/* Coinbase */}
          <button
            onClick={() => handleWalletConnect(connectCoinbase)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="font-bold text-white">Coinbase Wallet</p>
                  <p className="text-xs text-blue-200">Multi-cadena</p>
                </div>
              </div>
              {isLoading && <div className="animate-spin">⏳</div>}
            </div>
          </button>

          {/* Ledger */}
          <button
            onClick={() => handleWalletConnect(connectLedger)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <div className="text-left">
                  <p className="font-bold text-white">Ledger</p>
                  <p className="text-xs text-gray-300">Hardware Wallet</p>
                </div>
              </div>
              {isLoading && <div className="animate-spin">⏳</div>}
            </div>
          </button>

          {/* Mercado Pago */}
          <button
            onClick={() => handleWalletConnect(connectMercadoPago)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div className="text-left">
                  <p className="font-bold text-white">Mercado Pago</p>
                  <p className="text-xs text-yellow-200">Billetera Digital</p>
                </div>
              </div>
              {isLoading && <div className="animate-spin">⏳</div>}
            </div>
          </button>

          {/* Info */}
          <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-300/40 mt-4">
            <p className="text-blue-200 text-xs font-semibold">
              💡 Tip: Conecta tu wallet para acceder automáticamente a tu cuenta y usar tu billetera como método de pago.
            </p>
          </div>
        </div>
      )}

      {/* Passkey Section */}
      {selectedTab === 'passkey' && (
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-purple-300/40">
            <p className="text-white text-sm mb-4">
              Usa tu biometría (huella, cara o PIN) para una autenticación segura.
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg">
              🔐 Autenticarse con Passkey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
