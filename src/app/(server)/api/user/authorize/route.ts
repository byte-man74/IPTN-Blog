import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/app/(server)/modules/user/user.service';
import { AuthorizeUserSchema } from '@/app/(server)/modules/user/user.types';
import ApiCustomError from '@/types/api-custom-error';


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
