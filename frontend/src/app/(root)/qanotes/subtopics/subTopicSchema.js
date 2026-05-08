import { z } from 'zod'

export const subTopicSchema = z.object({
    // name: z
    //     .string()
    //     .min(4, 'Name is required')
    //     .max(16, 'Name must be at most 16 characters'),
    topicId: z.string().min(1, 'Topic is required'),

    subtopics: z
        .string()
        .min(1, 'At least one subtopic is required')
        .transform((val) =>
            val
                .split('\n')
                .map((s) => s.trim())
                .filter((s) => s.length > 0)
        ),
})


export const subtopicActionDataSchema = z.object({
    topicId: z.number({
        required_error: 'Topic is required',
        invalid_type_error: 'TopicId must be a number',
    }),

    subtopics: z
        .array(
            z
                .string()
                .min(1, 'Subtopic cannot be empty')
                .trim()
        )
        .min(1, 'At least one subtopic is required'),
})