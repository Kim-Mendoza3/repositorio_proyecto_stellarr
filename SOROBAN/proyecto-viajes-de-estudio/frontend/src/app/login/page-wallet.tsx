/**
 * Login Page with Wallet Integration
 * Enhanced authentication with wallet support
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletSelector } from '@/components/WalletSelector';

export default function LoginPage() {
  const router = useRouter();

  // El WalletSelector maneja la conexión y redirige automáticamente

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop")',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 z-0"></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m5.506 0C15.009 17.799 16 14.517 16 11m-6-1a4 4 0 11-8 0 4 4 0 018 0zm0 0a4 4 0 110 8 4 4 0 010-8zm-7 4a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">¡Bienvenido!</h1>
          <p className="text-white font-semibold drop-shadow-md text-lg">
            Accede a Viajes de Estudio MX
          </p>
        </div>

        <>
          {/* Info Banner */}
          <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-blue-300/40 shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-sm font-semibold drop-shadow-sm">
                  Conecta tu wallet para acceder instantáneamente. Tu wallet será tu método de pago para viajes.
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6">
              {/* Wallet Login */}
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>💳</span> Conectar Wallet
                </h2>
                <p className="text-gray-300 text-sm mb-6">
                  Selecciona tu wallet favorito para autenticarte y acceder a tu cuenta de forma segura.
                </p>
                <WalletSelector />
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
                  <div className="text-2xl mb-2">🔒</div>
                  <h3 className="text-white font-bold text-sm mb-1">Seguro</h3>
                  <p className="text-gray-300 text-xs">Autenticación descentralizada</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="text-white font-bold text-sm mb-1">Rápido</h3>
                  <p className="text-gray-300 text-xs">Sin verificaciones complicadas</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="text-white font-bold text-sm mb-1">Pago Directo</h3>
                  <p className="text-gray-300 text-xs">Paga con tu wallet</p>
                </div>
              </div>

              {/* Footer Links */}
              <div className="text-center space-y-3">
                <p className="text-gray-300 text-sm">
                  ¿No tienes wallet?{' '}
                  <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
                    Crear cuenta
                  </Link>
                </p>
                <p className="text-gray-400 text-xs">
                  Al conectar tu wallet aceptas nuestros{' '}
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                    términos de servicio
                  </Link>
                </p>
              </div>
            </div>
        </>
      </div>
    </div>
  );
}
