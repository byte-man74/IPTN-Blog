import { prisma } from '@/lib/third-party/prisma'
import { CreatePollDTO, PollDTO, PollWinnerDTO } from './poll.types'
import ApiCustomError from '@/types/api-custom-error'
import { tryCatchHandler } from '@/lib/utils/try-catch-handler'


export class PollRepository {
  private readonly poll = prisma.poll
  private readonly vote = prisma.vote

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

  async fetchAllPolls(): Promise<PollDTO[] | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const polls = await prisma.poll.findMany({
        include: {
          options: {
            include: {
              votes: true,
            },
          },
          votes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return polls
    })
  }

  //modify a poll
  async modifyPoll(
    pollId: number,
    data: Partial<CreatePollDTO>
  ): Promise<ApiCustomError | null | PollDTO> {
    return tryCatchHandler(async () => {
      const poll = await this.poll.findFirst({
        where: {
          id: pollId,
        },
      })

      if (!poll) {
        throw new ApiCustomError('Poll not found', 404)
      }

      const { options, ...pollData } = data

      return await this.poll.update({
        where: {
          id: pollId,
        },
        data: {
          ...pollData,
          options: options
            ? {
                deleteMany: {},
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

  //delete a poll
  async deletePoll(pollId: number): Promise<ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const poll = await this.poll.findFirst({
        where: {
          id: pollId,
        },
      })

      if (!poll) {
        throw new ApiCustomError('Poll not found', 404)
      }

      await this.poll.delete({
        where: {
          id: pollId,
        },
      })

      return null
    })
  }
  //vote on a poll
  async voteOnPoll(
    pollId: number,
    optionId: number,
    userId: string
  ): Promise<ApiCustomError | PollDTO | null> {
    return tryCatchHandler(async () => {
      const poll = await this.poll.findFirst({
        where: {
          id: pollId,
        },
        include: {
          options: true,
        },
      })

      if (!poll) {
        throw new ApiCustomError('Poll not found', 404)
      }

      const option = poll.options.find((opt) => opt.id === optionId)
      if (!option) {
        throw new ApiCustomError('Option not found', 404)
      }

      // Check if user already voted
      const existingVote = await this.vote.findFirst({
        where: {
          pollId,
          userId,
        },
      })

      if (existingVote) {
        // Update existing vote
        await this.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            optionId,
          },
        })
      } else {
        // Create new vote
        await this.vote.create({
          data: {
            pollId,
            optionId,
            userId,
          },
        })
      }

      return await this.poll.findFirst({
        where: {
          id: pollId,
        },
        include: {
          options: true,
          votes: true,
        },
      })
    })
  }

  //remove vote for a poll
  async removeVote(pollId: number, userId: string): Promise<PollDTO | null | ApiCustomError> {
    return tryCatchHandler(async () => {
      const poll = await this.poll.findFirst({
        where: {
          id: pollId,
        },
      })

      if (!poll) {
        throw new ApiCustomError('Poll not found', 404)
      }

      const vote = await this.vote.findFirst({
        where: {
          pollId,
          userId,
        },
      })

      if (!vote) {
        throw new ApiCustomError('Vote not found', 404)
      }

      await this.vote.delete({
        where: {
          id: vote.id,
        },
      })

      return await this.poll.findFirst({
        where: {
          id: pollId,
        },
        include: {
          options: true,
          votes: true,
        },
      })
    })
  }

  //find the winner of a poll
  async findPollWinner(pollId: number): Promise<PollWinnerDTO | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const poll = await this.poll.findFirst({
        where: {
          id: pollId,
        },
        include: {
          options: {
            include: {
              votes: true,
            },
          },
        },
      })

      if (!poll) {
        throw new ApiCustomError('Poll not found', 404)
      }

      if (poll.options.length === 0) {
        return null
      }

      let winningOption = poll.options[0]
      let maxVotes = winningOption.votes.length

      for (const option of poll.options) {
        if (option.votes.length > maxVotes) {
          winningOption = option
          maxVotes = option.votes.length
        }
      }

      return {
        option: winningOption,
        voteCount: maxVotes,
      }
    })
  }

  //fetch active polls
  async fetchActivePollsWithVotes(userId?: string): Promise<PollDTO[] | ApiCustomError | null> {
    return tryCatchHandler(async () => {
      const now = new Date()

      return await this.poll.findMany({
        where: {
          endDate: {
            gte: now,
          },
          startDate: {
            lte: now,
          },
          status: 'active',
        },
        include: {
          options: {
            include: {
              votes: true,
            },
          },
          votes: userId
            ? {
                where: {
                  userId,
                },
              }
            : true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })
  }
}
