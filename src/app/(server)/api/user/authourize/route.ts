import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/app/(server)/modules/user/user.service';
import { AuthorizeUserSchema } from '@/app/(server)/modules/user/user.types';
import ApiCustomError from '@/types/api-custom-error';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body against schema
    const validationResult = AuthorizeUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const authData = validationResult.data;

    // Validate user credentials using the service
    const userService = new UserService();
    const result = await userService.validateUserCredentials(authData);

    if (result instanceof ApiCustomError) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!result.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // create and set JWT cookie
    const token = sign(
      { userId: result.id, email: result.email }, // you can include any user info you want
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    (await cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(
      { message: 'Authentication successful', user: result },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
