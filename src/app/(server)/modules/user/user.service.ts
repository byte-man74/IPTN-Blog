import { UserRepository } from '@/app/(server)/modules/user/user.repository'
import {
  UpdateUserActivationDTO,
  UserDTO,
} from '@/app/(server)/modules/user/user.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'
import { cleanEmail } from '@/lib/utils/parser'
import { isValidEmail } from '@/lib/utils/validator'

export interface IUserService {
  getUserByEmail(email: string): Promise<UserDTO | null | ApiCustomError>
  updateUserActivationStatus(
    activationData: UpdateUserActivationDTO
  ): Promise<UserDTO | null | ApiCustomError>
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

  async updateUserActivationStatus(
    activationData: UpdateUserActivationDTO
  ): Promise<UserDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      // Clean email before updating
      activationData.email = cleanEmail(activationData.email)
      if (!isValidEmail(activationData.email)) {
        return new ApiCustomError('Bad Request', 400, 'Invalid email format')
      }

      const user = await this.repository.getUserInformation(activationData.email)

      if (!user || user instanceof ApiCustomError) {
        return new ApiCustomError('Not Found', 404, 'User not found')
      }

      return await this.repository.updateUser(user.id, {
        isActive: activationData.isActive,
      })
    })
  }
}
