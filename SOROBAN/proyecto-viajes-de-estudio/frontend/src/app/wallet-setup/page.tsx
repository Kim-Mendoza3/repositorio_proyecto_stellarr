'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function WalletSetupPage() {
  const router = useRouter();
  const [freighterDetected, setFreighterDetected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar periódicamente si Freighter está instalada
  useEffect(() => {
    const checkFreighter = async () => {
      setIsChecking(true);
      for (let i = 0; i < 30; i++) {
        if ((window as any).freighter) {
          setFreighterDetected(true);
          // Redirigir después de 2 segundos
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setIsChecking(false);
    };

    checkFreighter();
  }, [router]);

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
        {/* Freighter Detected */}
        {freighterDetected && (
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-8 border border-green-400/40 shadow-xl text-center animate-in fade-in">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Freighter Detectada!</h2>
            <p className="text-green-200 mb-4">Hemos detectado tu extensión Freighter instalada correctamente.</p>
            <p className="text-sm text-gray-300">Redirigiendo al login...</p>
            <div className="mt-4">
              <Loader className="w-5 h-5 animate-spin mx-auto text-green-400" />
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        {!freighterDetected && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-stellar to-cyan-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m5.506 0C15.009 17.799 16 14.517 16 11m-6-1a4 4 0 11-8 0 4 4 0 018 0zm0 0a4 4 0 110 8 4 4 0 010-8zm-7 4a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Configura tu Wallet</h1>
              <p className="text-white font-semibold drop-shadow-md text-lg">
                Instala Freighter para comenzar
              </p>
            </div>

            {/* Main Setup Card */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-stellar" />
                Paso 1: Descargar Freighter
              </h2>

              <div className="space-y-4 mb-8">
                <p className="text-gray-300">
                  Freighter es una extensión de navegador segura que protege tus activos en la red Stellar.
                </p>

                <div className="bg-blue-500/20 border border-blue-300/40 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm">
                    Solo usa Freighter descargado desde <strong>freighter.app</strong>. No confíes en otras fuentes.
                  </p>
                </div>

                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-stellar to-cyan-500 hover:from-stellar/90 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-stellar/50 text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Descargar Freighter (freighter.app)
                </a>
              </div>

              <hr className="border-slate-600 my-8" />

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Paso 2: Instalar Extensión
              </h2>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 font-semibold mb-2">Instrucciones por navegador:</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li><strong>Chrome/Brave:</strong> Click en la descarga → "Añadir a Chrome"</li>
                    <li><strong>Firefox:</strong> Click en la descarga → "Añadir a Firefox"</li>
                    <li><strong>Edge:</strong> Click en la descarga → "Obtener extensión"</li>
                  </ul>
                </div>

                <div className="bg-amber-500/20 border border-amber-300/40 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-200 text-sm font-semibold mb-2">Después de instalar:</p>
                    <ul className="text-amber-100 text-sm space-y-1">
                      <li>✓ Encontrarás el icono de Freighter en tu navegador</li>
                      <li>✓ Click en el icono para abrir la extensión</li>
                      <li>✓ Crea una nueva wallet o importa una existente</li>
                    </ul>
                  </div>
                </div>
              </div>

              <hr className="border-slate-600 my-8" />

              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                Paso 3: Espera Detección
              </h2>

              <div className="space-y-4">
                <p className="text-gray-300">
                  Estamos verificando si Freighter está instalada...
                </p>

                {isChecking && (
                  <div className="flex justify-center items-center gap-2 text-stellar">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Buscando Freighter...</span>
                  </div>
                )}

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Verificar Nuevamente
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="text-white font-bold text-sm mb-1">Seguro</h3>
                <p className="text-gray-300 text-xs">Tus claves privadas nunca dejan tu navegador</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-white font-bold text-sm mb-1">Rápido</h3>
                <p className="text-gray-300 text-xs">Transacciones instantáneas en Stellar</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="text-white font-bold text-sm mb-1">Descentralizado</h3>
                <p className="text-gray-300 text-xs">Control total de tus activos</p>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-300/40">
              <h3 className="text-blue-200 font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ¿Necesitas Ayuda?
              </h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>
                  📚{' '}
                  <a href="https://docs.freighter.app" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                    Documentación de Freighter
                  </a>
                </li>
                <li>
                  🎓{' '}
                  <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                    Aprende sobre Stellar
                  </a>
                </li>
                <li>
                  💬 Contacta nuestro soporte: support@viajesdeestudio.mx
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





