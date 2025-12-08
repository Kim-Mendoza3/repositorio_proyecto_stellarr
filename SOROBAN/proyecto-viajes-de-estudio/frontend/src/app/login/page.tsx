/**
 * Login Page with Freighter Wallet Authentication
 * Simplified flow: Click to connect, catch errors on failure
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { usePersistUserRegistry } from '@/hooks/usePersistUserRegistry';
import { Wallet, AlertCircle, Loader, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useUserRegistry } from '@/hooks/useUserRegistry';

export default function LoginPage() {
  // Sincronizar registry persistentemente
  usePersistUserRegistry();

  const router = useRouter();
  const { account, isConnecting, connectWallet, error } = useWallet();
  const { getUserByWallet } = useUserRegistry();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isLoadingManual, setIsLoadingManual] = useState(false);
  const [manualError, setManualError] = useState('');

  // Al intentar conectar con Freighter
  const handleConnectFreighter = async () => {
    try {
      setShowInstallGuide(false);
      console.log('🔗 Usuario hace click para conectar wallet con Freighter');
      await connectWallet();
    } catch (err: any) {
      console.error('❌ Error de conexión:', err);
      const errorMsg = err.message || 'Error desconocido';
      
      // Si el error menciona Freighter o no está disponible
      if (errorMsg.includes('Freighter') || errorMsg.includes('disponible')) {
        console.log('⚠️ Freighter no disponible - mostrando opciones alternativas');
        setShowInstallGuide(true);
      } else {
        // Para otros errores (ej: problemas de red, cuenta no existe, etc)
        console.log('⚠️ Error de conexión:', errorMsg);
      }
    }
  };

  // Conectar manualmente con dirección
  const handleManualLogin = async () => {
    setIsLoadingManual(true);
    setManualError('');

    try {
      if (!manualAddress.trim()) {
        setManualError('Ingresa una dirección de wallet');
        setIsLoadingManual(false);
        return;
      }

      // Validar formato
      if (!manualAddress.startsWith('G') || manualAddress.length !== 56) {
        setManualError('Dirección inválida. Debe comenzar con G y tener 56 caracteres');
        setIsLoadingManual(false);
        return;
      }

      // Verificar que exista en el registro
      const user = await getUserByWallet(manualAddress);
      if (!user) {
        setManualError('Esta wallet no está registrada. Crea una cuenta primero.');
        setIsLoadingManual(false);
        return;
      }

      // Simular "conexión" guardando en localStorage
      localStorage.setItem('walletAddress', manualAddress);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTime', new Date().toISOString());

      // Redirigir según tipo de usuario
      setTimeout(() => {
        if (user.userType === 'company') {
          router.push('/company-dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (err: any) {
      setManualError(err.message || 'Error al iniciar sesión');
      setIsLoadingManual(false);
    }
  };

  // Si ya está conectado, redirigir al dashboard correcto según tipo de usuario
  useEffect(() => {
    if (account) {
      console.log('✅ [LOGIN] Wallet conectada:', account.publicKey);
      
      // Buscar el usuario en el registro (async)
      const checkUser = async () => {
        const user = await getUserByWallet(account.publicKey);
        
        if (user) {
          console.log('👤 [LOGIN] Usuario encontrado:', user.userType);
          
          // Guardar sesión
          localStorage.setItem('walletAddress', account.publicKey);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('loginTime', new Date().toISOString());
          localStorage.setItem('current_user', JSON.stringify(user));
          
          // Redirigir según tipo de usuario
          setTimeout(() => {
            if (user.userType === 'company') {
              console.log('🏢 [LOGIN] Redirigiendo a company-dashboard');
              router.push('/company-dashboard');
            } else {
              console.log('👨‍🎓 [LOGIN] Redirigiendo a dashboard');
              router.push('/dashboard');
            }
          }, 1500);
        } else {
          console.log('❌ [LOGIN] Usuario NO encontrado en registro');
          setManualError('Esta wallet no está registrada. Crea una cuenta primero.');
        }
      };
      
      checkUser();
    }
  }, [account, getUserByWallet, router]);

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
          <div className="inline-block p-4 bg-gradient-to-r from-stellar to-cyan-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m5.506 0C15.009 17.799 16 14.517 16 11m-6-1a4 4 0 11-8 0 4 4 0 018 0zm0 0a4 4 0 110 8 4 4 0 010-8zm-7 4a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">¡Bienvenido!</h1>
          <p className="text-white font-semibold drop-shadow-md text-lg">
            Viajes de Estudio MX
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Success State - Connected */}
          {account && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-400/40 shadow-xl text-center animate-in fade-in">
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Sesión Iniciada!</h2>
              <p className="text-green-200 mb-4">Tu wallet está conectada correctamente</p>
              <p className="text-sm text-gray-300 break-all font-mono bg-black/30 rounded-lg p-3 mb-4">
                {account.publicKey.slice(0, 10)}...{account.publicKey.slice(-8)}
              </p>
              <p className="text-sm text-gray-300">Redirigiendo al dashboard...</p>
              <div className="mt-4">
                <Loader className="w-5 h-5 animate-spin mx-auto text-stellar" />
              </div>
            </div>
          )}

          {/* Checking State */}
          {!account && !showInstallGuide && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-2xl">🚀</span> Conectar con Freighter
              </h2>
              <p className="text-gray-300 text-sm mb-6">
                Inicia sesión de forma segura usando tu wallet Freighter. Tu dirección será tu identificador único.
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Connect Button */}
              <button
                onClick={handleConnectFreighter}
                disabled={isConnecting}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg ${
                  isConnecting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-stellar to-cyan-500 hover:from-stellar/90 hover:to-cyan-600 text-white shadow-lg hover:shadow-stellar/50'
                }`}
              >
                {isConnecting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Conectar Wallet Freighter
                  </>
                )}
              </button>

              {/* Info Box */}
              <div className="mt-6 bg-blue-500/20 backdrop-blur-md rounded-xl p-4 border border-blue-300/40">
                <p className="text-blue-200 text-sm font-semibold mb-2">💡 ¿Cómo funciona?</p>
                <ul className="text-blue-100 text-sm space-y-1">
                  <li>✓ Conecta tu wallet Freighter</li>
                  <li>✓ Tu dirección será tu cuenta</li>
                  <li>✓ Paga viajes directamente desde tu wallet</li>
                  <li>✓ Sin contraseñas, 100% seguro</li>
                </ul>
              </div>
            </div>
          )}

          {/* Freighter Not Found - Dual Options */}
          {!account && showInstallGuide && (
            <div className="space-y-4">
              {/* Option 1: Install Freighter */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 border border-amber-400/40 shadow-xl">
                <div className="flex items-start gap-4 mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">🟡 Opción 1: Instalar Freighter</h3>
                    <p className="text-gray-200 mb-4">
                      Descarga la extensión segura Freighter para conectarte automáticamente.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.open('https://freighter.app', '_blank');
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-5 h-5" />
                    Descargar Freighter desde freighter.app
                  </button>
                  <button
                    onClick={() => {
                      setShowInstallGuide(false);
                    }}
                    className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-2 px-6 rounded-lg transition-all"
                  >
                    ↺ Reintentar después de instalar
                  </button>
                </div>
              </div>

              {/* Option 2: Manual Entry */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-purple-400/40 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🟣</span> Opción 2: Ingresa Manual
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  ¿Ya tienes registrada una wallet? Ingresa tu dirección Stellar manualmente.
                </p>

                {manualError && (
                  <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-200 text-sm">{manualError}</p>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Ej: GBUQWP3BOUZX34LOCALQVFSGHFTOJREM23NRHBK264KEXWFNVLB74OOO"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value.trim())}
                  disabled={isLoadingManual}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50 mb-4 font-mono text-sm"
                />

                <button
                  onClick={handleManualLogin}
                  disabled={isLoadingManual}
                  className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isLoadingManual
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                  }`}
                >
                  {isLoadingManual ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>

              {/* Help Link */}
              <div className="text-center">
                <Link 
                  href="/diagnostics" 
                  className="text-slate-400 hover:text-slate-300 text-sm underline"
                >
                  ¿Necesitas ayuda? Ver diagnóstico técnico
                </Link>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-white font-bold text-sm mb-1">Seguro</h3>
              <p className="text-gray-300 text-xs">Autenticación descentralizada con tu wallet</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-white font-bold text-sm mb-1">Instantáneo</h3>
              <p className="text-gray-300 text-xs">Acceso inmediato sin verificaciones</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-white/40 transition-colors">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="text-white font-bold text-sm mb-1">Pagos XLM</h3>
              <p className="text-gray-300 text-xs">Paga viajes con Stellar XLM</p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-3">
            <p className="text-gray-300 text-sm">
              ¿Primera vez aquí?{' '}
              <Link href="/register" className="text-stellar hover:text-cyan-400 font-semibold">
                Crea tu cuenta
              </Link>
            </p>
            <p className="text-gray-400 text-xs">
              Al conectar tu wallet aceptas nuestros{' '}
              <Link href="/terms" className="text-stellar hover:text-cyan-400">
                términos de servicio
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



