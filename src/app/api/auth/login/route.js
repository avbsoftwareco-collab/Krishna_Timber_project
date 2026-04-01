
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sheets, spreadsheetId } from '../../config/googleSheet';

const ALLOWED_USER_TYPES = ['ADMIN', 'VIJAY', 'Approvel2', 'RICHA'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email और password जरूरी हैं' },
        { status: 400 }
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId : spreadsheetId ,
      range: 'Users!A:D',
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return NextResponse.json(
        { success: false, error: 'कोई user नहीं मिला' },
        { status: 404 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRow = rows.slice(1).find(row => 
      row[0]?.trim().toLowerCase() === normalizedEmail &&
      row[1]?.trim() === password.trim()
    );

    if (!userRow) {
      return NextResponse.json(
        { success: false, error: 'गलत email या password' },
        { status: 401 }
      );
    }

    const userTypeRaw = (userRow[2] || '').trim().toUpperCase();
    const name = (userRow[3] || 'User').trim();

    // Normalize user type
    let userType = userTypeRaw;
    if (userType.includes('ADMIN')) userType = 'ADMIN';
    if (userType.includes('VIJAY')) userType = 'VIJAY';
    if (userType.includes('APPROVEL')) userType = 'APPROVEL2';
    if (userType.includes('RICHA')) userType = 'RICHA';

    if (!ALLOWED_USER_TYPES.includes(userType)) {
      return NextResponse.json(
        { success: false, error: 'अनुमति नहीं है' },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      { email: normalizedEmail, userType, name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      success: true,
      token,
      userType,
      name,
      message: 'Login सफल!'
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}