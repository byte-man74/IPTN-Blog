import { UserRepository } from '@/app/(server)/modules/user/user.repository'
import { UserDTO } from '@/app/(server)/modules/user/user.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { cleanEmail } from '@/lib/utils/parser'
import { isValidEmail } from '@/lib/utils/validator'

export interface IUserService {
  getUserByEmail(email: string): Promise<UserDTO | null | ApiCustomError>
  updateUserInformation(user: Partial<UserDTO>): Promise<UserDTO | null | ApiCustomError>
  fetchUsers(): Promise<UserDTO[] | ApiCustomError | null>
}

export class UserService implements IUserService {
  private readonly repository: UserRepository

  constructor(repository: UserRepository = new UserRepository()) {
    this.repository = repository
  }

  async getUserByEmail(email: string): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Clean email before querying
      const cleanedEmail = cleanEmail(email)
      const user = await this.repository.getUserInformation(cleanedEmail)

      if (!user) {
        return new ApiCustomError('Not Found', 404, 'User not found')
      }

      return user
    })
  }

  async updateUserInformation(user: Partial<UserDTO>): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      if (!user.id) {
        return new ApiCustomError('Bad Request', 400, 'User ID is required')
      }

      if (user.email && !isValidEmail(user.email)) {
        return new ApiCustomError('Bad Request', 400, 'Invalid email format')
      }

      // If email is provided, clean it
      if (user.email) {
        user.email = cleanEmail(user.email)
      }

      // Update user in the repository
      const updatedUser = await this.repository.updateUser(user.id, user)

      if (!updatedUser) {
        return new ApiCustomError('Not Found', 404, 'User not found or could not be updated')
      }

      return updatedUser
    })
  }

  async fetchUsers(): Promise<UserDTO[] | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const users = await this.repository.fetchUsers()

      return users
    })
  }
}
