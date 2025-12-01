import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

// Asegurar que el directorio de datos existe
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Leer reservas de archivo
function readReservations() {
  ensureDataDir();
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([]));
    return [];
  }
  let data = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
  // Limpiar BOM y caracteres especiales
  data = data.replace(/^\uFEFF/, '').trim();
  // Si el archivo está vacío o solo tiene espacios, retornar array vacío
  if (!data || data === '') {
    return [];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar reservas a archivo
function saveReservations(reservations: any[]) {
  ensureDataDir();
  fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tripId, clientWallet, companyWallet, amount } = body;

    if (!tripId || !clientWallet || !companyWallet || !amount) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    const reservation = {
      id: `reservation_${Date.now()}`,
      tripId,
      clientWallet,
      companyWallet,
      amount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const reservations = readReservations();
    reservations.push(reservation);
    saveReservations(reservations);

    // Actualizar booking count en el viaje
    const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');
    if (fs.existsSync(TRIPS_FILE)) {
      const tripsData = fs.readFileSync(TRIPS_FILE, 'utf-8');
      let trips = JSON.parse(tripsData);
      
      trips = trips.map((trip: any) => {
        if (trip.id === tripId) {
          return { ...trip, currentBookings: (trip.currentBookings || 0) + 1 };
        }
        return trip;
      });

      fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2));
    }

    return NextResponse.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('POST /api/reservations error:', error);
    return NextResponse.json({
      success: false,
      message: String(error)
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientWallet = searchParams.get('clientWallet');

    const reservations = readReservations();

    if (clientWallet) {
      const filtered = reservations.filter((r: any) => r.clientWallet === clientWallet);
      return NextResponse.json({
        success: true,
        reservations: filtered,
        count: filtered.length
      });
    }

    return NextResponse.json({
      success: true,
      reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('GET /api/reservations error:', error);
    return NextResponse.json({
      success: false,
      message: String(error)
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reservationId, clientWallet, txHash } = body;

    if (!reservationId || !clientWallet || !txHash) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    const reservations = readReservations();
    const updated = reservations.map((r: any) => {
      if (r.id === reservationId && r.clientWallet === clientWallet) {
        return {
          ...r,
          status: 'completed',
          txHash,
        };
      }
      return r;
    });

    saveReservations(updated);

    return NextResponse.json({
      success: true,
      message: 'Reservation updated'
    });
  } catch (error) {
    console.error('PATCH /api/reservations error:', error);
    return NextResponse.json({
      success: false,
      message: String(error)
    }, { status: 500 });
  }
}
