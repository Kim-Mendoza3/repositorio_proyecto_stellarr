'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTripOffers } from '@/hooks/useTripOffers';
import { useStellarTransaction } from '@/hooks/useStellarTransaction';
import { useWallet } from '@/contexts/WalletContext';
import { FreighterStatus } from '@/components/FreighterStatus';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, Zap, Send } from 'lucide-react';

function TripDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');

  const { getTripById } = useTripOffers();
  const { sendPayment, getFreighterWallet, isProcessing } = useStellarTransaction();
  const { account } = useWallet();

  const [trip, setTrip] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [transactionStatus, setTransactionStatus] = React.useState<'idle' | 'signing' | 'submitting' | 'registering' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (tripId) {
      // Esperar a que se carguen los viajes
      const checkTrip = async () => {
        setLoading(true);
        // Dar tiempo a que useTripOffers cargue los viajes
        await new Promise(resolve => setTimeout(resolve, 500));
        const tripData = getTripById(tripId);
        if (tripData) {
          console.log('✅ Viaje encontrado:', tripId);
          setTrip(tripData);
        } else {
          console.error('❌ Viaje no encontrado:', tripId);
          setTrip(null);
        }
        setLoading(false);
      };
      checkTrip();
    }
  }, [tripId, getTripById]);

  const handleReserveTrip = async () => {
    if (!trip || !account) {
      alert('Error: Información incompleta');
      return;
    }

    try {
      setTransactionStatus('signing');
      setErrorMessage('');
      console.log('🔄 Iniciando proceso de reserva...');

      // 1. Obtener wallet de Freighter
      const clientWallet = await getFreighterWallet();
      if (!clientWallet) {
        throw new Error('No se pudo obtener la wallet de Freighter. Asegúrate de tener Freighter instalado y conectado.');
      }

      console.log('✅ Wallet obtenida:', clientWallet.substring(0, 10) + '...');

      // 2. Cambiar a estado "submitting" 
      setTransactionStatus('submitting');

      // 3. Crear transacción de pago
      console.log('📤 Enviando pago a empresa:', trip.companyWallet);
      const paymentResult = await sendPayment(
        clientWallet,
        trip.companyWallet,
        trip.priceXLM,
        `Reserva: ${trip.name}`
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Error en la transacción de pago');
      }

      console.log('✅ Pago completado:', paymentResult.hash);
      if (paymentResult.hash) {
        setTransactionHash(paymentResult.hash);
      }

      // 4. Cambiar a estado "registering"
      setTransactionStatus('registering');

      // 5. Guardar reserva en la API
      console.log('📝 Registrando reserva...');
      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id,
          clientWallet,
          companyWallet: trip.companyWallet,
          amount: trip.priceXLM,
          txHash: paymentResult.hash,
          status: 'completed',
        }),
      });

      if (!reservationResponse.ok) {
        throw new Error('Error guardando la reserva. El pago fue procesado pero la reserva no se guardó.');
      }

      const reservationData = await reservationResponse.json();
      console.log('✅ Reserva registrada:', reservationData);

      setTransactionStatus('success');
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ Error:', message);
      setErrorMessage(message);
      setTransactionStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>
        <div className="text-center">
          <p className="text-gray-400">Cargando detalles del viaje...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Viaje no encontrado</h1>
            <p className="text-gray-300 mb-4">El viaje que buscas no existe o ha sido eliminado.</p>
            <p className="text-gray-400 text-sm mb-6">ID: {tripId}</p>
            <button
              onClick={() => router.push('/available-trips')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Ver Viajes Disponibles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver a viajes
      </button>

      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
          <p className="text-blue-100">{trip.destination}</p>
        </div>

        {/* Freighter Status */}
        <div className="px-8 pt-6">
          <FreighterStatus />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Detalles */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Detalles</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Duración</p>
                  <p className="text-white font-semibold">{trip.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Descripción</p>
                  <p className="text-white">{trip.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Espacios disponibles</p>
                  <p className="text-white font-semibold">
                    {trip.maxParticipants - trip.currentBookings} / {trip.maxParticipants}
                  </p>
                </div>
                {trip.highlights && trip.highlights.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Destacados</p>
                    <ul className="list-disc list-inside text-white">
                      {trip.highlights.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Precio y reserva */}
            <div>
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-400 mb-2">Precio por persona</p>
                <p className="text-4xl font-bold text-blue-400 mb-4">{trip.priceXLM} XLM</p>
                
                {transactionStatus === 'idle' && (
                  <button
                    onClick={handleReserveTrip}
                    disabled={isProcessing || trip.maxParticipants - trip.currentBookings <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
                  >
                    {isProcessing ? 'Procesando...' : 'Reservar Ahora'}
                  </button>
                )}

                {(transactionStatus === 'signing' || transactionStatus === 'submitting' || transactionStatus === 'registering') && (
                  <div className="space-y-3">
                    <div className="bg-blue-900 text-blue-200 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span className="font-bold">Procesando transacción Stellar...</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className={`flex items-center gap-2 ${transactionStatus === 'signing' ? 'text-blue-300' : 'text-blue-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${transactionStatus === 'signing' ? 'animate-pulse bg-blue-300' : 'bg-green-400'}`} />
                          {transactionStatus === 'signing' ? '🔐 Esperando firma en Freighter...' : '✓ Firmada'}
                        </div>
                        <div className={`flex items-center gap-2 ${transactionStatus === 'submitting' ? 'text-blue-300' : transactionStatus === 'signing' ? 'text-gray-400' : 'text-blue-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${transactionStatus === 'submitting' ? 'animate-pulse bg-blue-300' : transactionStatus === 'signing' ? 'bg-gray-500' : 'bg-green-400'}`} />
                          {transactionStatus === 'submitting' ? '📤 Enviando a blockchain...' : transactionStatus === 'signing' ? 'Enviando...' : '✓ Enviada'}
                        </div>
                        <div className={`flex items-center gap-2 ${transactionStatus === 'registering' ? 'text-blue-300' : transactionStatus !== 'signing' ? 'text-blue-400' : 'text-gray-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${transactionStatus === 'registering' ? 'animate-pulse bg-blue-300' : transactionStatus !== 'signing' && transactionStatus !== 'submitting' ? 'bg-green-400' : 'bg-gray-500'}`} />
                          {transactionStatus === 'registering' ? '📝 Registrando reserva...' : '⏳ Registrando...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {transactionStatus === 'success' && (
                  <div className="flex items-start gap-3 bg-green-900 text-green-200 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">¡Reserva exitosa!</p>
                      <p className="text-sm mt-2">Tu pago de {trip.priceXLM} XLM ha sido procesado correctamente.</p>
                      <p className="text-xs text-green-300 mt-2 break-all">Hash: {transactionHash}</p>
                      <button
                        onClick={() => router.push('/available-trips')}
                        className="text-sm underline hover:no-underline mt-3 font-semibold"
                      >
                        Volver a viajes
                      </button>
                    </div>
                  </div>
                )}

                {transactionStatus === 'error' && (
                  <div className="flex items-start gap-3 bg-red-900 text-red-200 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error en la transacción</p>
                      <p className="text-sm mt-1">{errorMessage}</p>
                      <button
                        onClick={() => {
                          setTransactionStatus('idle');
                          setErrorMessage('');
                        }}
                        className="text-sm underline hover:no-underline mt-3 font-semibold"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-700 rounded-lg p-4 text-sm text-gray-300">
                <p>💡 Se requiere Freighter Wallet conectada para realizar la reserva.</p>
                <p className="text-xs text-gray-400 mt-2">
                  ¿No tienes Freighter? <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Descargar aquí</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"><p className="text-gray-400">Cargando detalles del viaje...</p></div>}>
      <TripDetailContent />
    </Suspense>
  );
}





