import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';



export async function POST() {
  try {
    // Clear the authentication token cookie
    (await cookies()).delete({
      name: 'token',
      path: '/',
    });

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
