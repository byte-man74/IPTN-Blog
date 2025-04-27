import { z } from "zod";

export const PollOptionSchema = z.object({
  id: z.number(),
  text: z.string(),
  pollId: z.number(),
  votes: z.array(z.object({
    id: z.number(),
    pollId: z.number(),
    optionId: z.number(),
    userId: z.string().nullable().optional()
  })).optional()
})

export const VoteSchema = z.object({
  id: z.number(),
  pollId: z.number(),
  optionId: z.number(),
  userId: z.string().nullable().optional()
})

export const PollWinnerSchema = z.object({
  option: PollOptionSchema,
  voteCount: z.number()
})




export const PollSchema = z.object({
    id: z.number().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.string().default("active"),
    createdAt: z.date(),
    updatedAt: z.date(),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),
    userId: z.string().nullable().optional(),
    options: z.array(z.object({
        id: z.number(),
        text: z.string(),
        pollId: z.number()
    })).optional(),
    votes: z.array(z.object({
        id: z.number(),
        pollId: z.number(),
        optionId: z.number(),
        userId: z.string().nullable().optional()
    })).optional()
})

export const CreatePollSchema = PollSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    votes: true,
    status: true
})


export type PollDTO = z.infer<typeof PollSchema>
export type CreatePollDTO = z.infer<typeof CreatePollSchema>
export type PollOptionDTO = z.infer<typeof PollOptionSchema>
export type VoteDTO = z.infer<typeof VoteSchema>
export type PollWinnerDTO = z.infer<typeof PollWinnerSchema>

