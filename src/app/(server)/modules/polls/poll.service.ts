import ApiCustomError from '@/types/api-custom-error'
import { PollRepository } from './poll.repository'
import { CreatePollDTO, PollDTO, PollWinnerDTO } from './poll.types'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'

export interface IPollService {
  createPoll(poll: CreatePollDTO): Promise<PollDTO | null | ApiCustomError>
  modifyPoll(pollId: number, data: Partial<CreatePollDTO>): Promise<PollDTO | null | ApiCustomError>
  deletePoll(pollId: number): Promise<null | ApiCustomError>
  voteOnPoll(
    pollId: number,
    optionId: number,
    userId: string
  ): Promise<PollDTO | null | ApiCustomError>
  removeVote(pollId: number, userId: string): Promise<PollDTO | null | ApiCustomError>
  findPollWinner(pollId: number): Promise<PollWinnerDTO | null | ApiCustomError>
  fetchActivePollsWithVotes(userId?: string): Promise<PollDTO[] | null | ApiCustomError>
  fetchAllPolls(): Promise<PollDTO[] | null | ApiCustomError>
}

export class PollService implements IPollService {
  private readonly repository: PollRepository

  /**
   * Initializes the PollService with required repository
   */
  constructor() {
    this.repository = new PollRepository()
  }

  /**
   * Creates a new poll
   * @param poll - The poll data to create
   * @returns The created poll or error
   */
  async createPoll(poll: CreatePollDTO): Promise<PollDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.createPoll(poll)
    })
  }

  /**
   * Modifies an existing poll
   * @param pollId - The ID of the poll to modify
   * @param data - The updated poll data
   * @returns The updated poll or error
   */
  async modifyPoll(
    pollId: number,
    data: Partial<CreatePollDTO>
  ): Promise<PollDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.modifyPoll(pollId, data)
    })
  }

  /**
   * Deletes a poll
   * @param pollId - The ID of the poll to delete
   * @returns Null on success or error
   */
  async deletePoll(pollId: number): Promise<null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.deletePoll(pollId)
    })
  }

  /**
   * Records a vote on a poll
   * @param pollId - The ID of the poll
   * @param optionId - The ID of the selected option
   * @param userId - The ID of the user voting
   * @returns The updated poll with votes or error
   */
  async voteOnPoll(
    pollId: number,
    optionId: number,
    userId: string
  ): Promise<PollDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.voteOnPoll(pollId, optionId, userId)
    })
  }

  /**
   * Removes a user's vote from a poll
   * @param pollId - The ID of the poll
   * @param userId - The ID of the user
   * @returns The updated poll or error
   */
  async removeVote(pollId: number, userId: string): Promise<PollDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.removeVote(pollId, userId)
    })
  }

  /**
   * Determines the winning option for a poll
   * @param pollId - The ID of the poll
   * @returns The winning option and vote count or error
   */
  async findPollWinner(pollId: number): Promise<PollWinnerDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.findPollWinner(pollId)
    })
  }

  /**
   * Fetches all currently active polls with their votes
   * @param userId - Optional user ID to check if the user has voted
   * @returns Array of active polls or error
   */
  async fetchActivePollsWithVotes(userId?: string): Promise<PollDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.fetchActivePollsWithVotes(userId)
    })
  }

  /**
   * Fetches all polls regardless of status
   * @returns Array of all polls or error
   */
  async fetchAllPolls(): Promise<PollDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      return await this.repository.fetchAllPolls()
    })
  }
}
