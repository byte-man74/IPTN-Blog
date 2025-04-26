import { prisma } from '@/lib/third-party/prisma'
import { CreatePollDTO, PollDTO } from './poll.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'

export class PollsRepository {
  private readonly poll = prisma.poll

  //create a poll
  async createPoll(poll: CreatePollDTO): Promise<ApiCustomError | null | PollDTO> {
    return tryCatchHandler(async () => {
      const { options, ...pollData } = poll
      return await this.poll.create({
        data: {
          ...pollData,
          options: options
            ? {
                create: options.map((option) => ({
                  text: option.text,
                })),
              }
            : undefined,
        },
        include: {
          options: true,
          votes: true,
        },
      })
    })
  }

  //modify a poll

  //delete a poll

  //vote on a poll

  //remove vote for a poll

  //find the winner of a pol
}
