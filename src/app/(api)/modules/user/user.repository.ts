import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import ApiCustomError from '@/types/api-custom-error'
import { PrismaClient } from '@prisma/client'
import {
  CreateUserDTO,
  SecuredUserInformationDTO,
  UserDTO,
} from '@/app/(api)/modules/user/user.types'

const prisma = new PrismaClient()

export class UserRepository {
  private readonly user = prisma.user

  async createUser(user: CreateUserDTO): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          password: user.password,
        },
      })
    })
  }

  //grab user information on login
  async getUserInformation(email: string): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isAdmin: true,
        },
      })
    })
  }

  //will probably use this for authentication
  async getUserPassword(
    email: string
  ): Promise<SecuredUserInformationDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      })
    })
  }
}
