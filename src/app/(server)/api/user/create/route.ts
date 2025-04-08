import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/app/(server)/modules/user/user.service'
import { CreateUserSchema } from '@/app/(server)/modules/user/user.types'
import ApiCustomError from '@/types/api-custom-error'
import { isValidJson } from '@/lib/utils/validator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ensure body is a valid JSON object using utility function
    if (!isValidJson(body)) {
      return NextResponse.json(
        { error: 'Invalid request format: Expected JSON object' },
        { status: 400 }
      )
    }

    // Validate request body against schema
    const validationResult = CreateUserSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const userData = validationResult.data

    // Create user
    const userService = new UserService()
    const result = await userService.createUser(userData)

    if (result instanceof ApiCustomError) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status }
      )
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      result,
      { status: 201 }
    )
  } catch{
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
