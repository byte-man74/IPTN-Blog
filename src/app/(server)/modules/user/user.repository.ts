import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import ApiCustomError from '@/types/api-custom-error'
import { PrismaClient } from '@prisma/client'
import {
  CreateUserDTO,
  SecuredUserInformationDTO,
  UserDTO,
} from '@/app/(server)/modules/user/user.types'

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
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          image: true,
          lastName: true,
          isAdmin: true,
          isActive: true,
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
          image: true,
          isAdmin: true,
          isActive: true,
        },
      })
    })
  }

  //will probably use this for authentication
  async getUserPassword(email: string): Promise<SecuredUserInformationDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
        },
      })
    })
  }

  async fetchUsers(): Promise<UserDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const users = await this.user.findMany({
        where: {
          email: {
            not: process.env.SECRET_USER,
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          image: true,
          isAdmin: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              news: true
            }
          }
        },
      });

      return users.map(user => ({
        ...user,
        newsCount: user._count.news,
        createdAt: user.createdAt.toISOString(),
      }));
    })
  }

  //will handle stuffs like making users an admin.. etc
  async updateUser(
    userId: string,
    userData: Partial<CreateUserDTO>
  ): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.user.update({
        where: {
          id: userId,
        },
        data: {
          ...userData,
        },
        select: {
          id: true,
          firstName: true,
          image: true,
          lastName: true,
          email: true,
          isAdmin: true,
          isActive: true,
        },
      })
    })
  }
}
