import { z } from 'zod';

export const UpdatePetPostSchema = z.object({
    pet_name: z
        .string()
        .min(3, 'pet_name must be at least 3 characters long')
        .max(30, 'pet_name must be at most 30 characters long')
        .optional(),

    description: z
        .string()
        .min(5, 'description must be at least 5 characters long')
        .max(500, 'description must be at most 500 characters long')
        .optional(),

    image_url: z
        .string()
        .url('image_url must be a valid URL')
        .optional(),

    status: z
        .enum(['lost', 'found', 'adopted'], {
            errorMap: () => ({ message: 'status must be one of: lost, found, adopted' }),
        })
        .optional(),

    hasfound: z
        .boolean()
        .optional(),
});

export class UpdatePetPostDto {
    constructor(
        public readonly pet_name?: string,
        public readonly description?: string,
        public readonly image_url?: string,
        public readonly status?: 'lost' | 'found' | 'adopted',
        public readonly hasfound?: boolean,
    ) { }

    static execute(input: { [key: string]: any }): [string?, UpdatePetPostDto?] {
        const parseResult = UpdatePetPostSchema.safeParse(input);

        if (!parseResult.success) {
            const error = parseResult.error.errors[0]?.message ?? 'Validation failed';
            return [error];
        }

        const { pet_name, description, image_url, status, hasfound } = parseResult.data;
        return [undefined, new UpdatePetPostDto(pet_name, description, image_url, status, hasfound)];
    }
}
