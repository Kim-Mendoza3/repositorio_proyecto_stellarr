/**
 * API Route: POST /api/users/register
 * Registra un usuario en Soroban (blockchain)
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Use /tmp in Netlify (serverless), fallback to data/ in local dev
const isNetlify = process.env.NETLIFY === 'true';
const DATA_DIR = isNetlify 
  ? '/tmp/viajar-data' 
  : path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

console.log(`[USERS API] Using DATA_DIR: ${DATA_DIR} (Netlify: ${isNetlify})`);

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readUsers = () => {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      let data = fs.readFileSync(USERS_FILE, 'utf-8');
      // Limpiar BOM y caracteres especiales
      data = data.replace(/^\uFEFF/, '').trim();
      // Si el archivo está vacío o solo tiene espacios, retornar array vacío
      if (!data || data === '') {
        return [];
      }
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error leyendo usuarios:', e);
  }
  return [];
};

const writeUsers = (users: any[]) => {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 [API] Registrando usuario:', body.name);

    // Validar datos
    if (!body.publicKey || !body.userType || !body.email) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Leer usuarios actuales
    const users = readUsers();

    // Verificar que la wallet sea única
    if (users.find((u: any) => u.publicKey === body.publicKey)) {
      return NextResponse.json(
        { error: 'Esta wallet ya está registrada' },
        { status: 400 }
      );
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...body,
      registrationDate: new Date().toISOString(),
    };

    // Guardar en "Soroban" (archivo)
    users.push(newUser);
    writeUsers(users);

    console.log('✅ [API] Usuario registrado exitosamente');
    console.log(`📊 [API] Total usuarios: ${users.length}`);

    return NextResponse.json({
      success: true,
      user: newUser,
      totalUsers: users.length,
    });
  } catch (error: any) {
    console.error('❌ [API] Error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = readUsers();
    console.log(`📊 [API] GET /users - Retornando ${users.length} usuarios`);
    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error: any) {
    console.error('❌ [API] Error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
