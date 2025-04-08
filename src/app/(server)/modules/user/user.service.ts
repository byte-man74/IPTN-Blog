import { UserRepository } from '@/app/(server)/modules/user/user.repository'
import { CreateUserDTO, UserDTO } from '@/app/(server)/modules/user/user.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { hashPassword, validatePassword } from '@/lib/utils/auth'

export interface IUserService {
  createUser(userData: CreateUserDTO): Promise<UserDTO | null | ApiCustomError>
  getUserByEmail(email: string): Promise<UserDTO | null | ApiCustomError>
  validateUserCredentials(email: string, password: string): Promise<UserDTO | null | ApiCustomError>
}

export class UserService implements IUserService {
  private readonly repository: UserRepository

  constructor(repository: UserRepository = new UserRepository()) {
    this.repository = repository
  }

  async createUser(userData: CreateUserDTO): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      userData.password = await hashPassword(userData.password)
      return await this.repository.createUser(userData)
    })
  }

  async getUserByEmail(email: string): Promise<UserDTO | null | ApiCustomError> {
    return await this.repository.getUserInformation(email)
  }

  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const userSecuredInformation = await this.repository.getUserPassword(email)

      if (!userSecuredInformation || userSecuredInformation instanceof ApiCustomError) {
        return null
      }

      const passwordMatch = await validatePassword(password, userSecuredInformation.password)

      if (!passwordMatch) {
        return null
      }

      return await this.getUserByEmail(email)
    })
  }
}
