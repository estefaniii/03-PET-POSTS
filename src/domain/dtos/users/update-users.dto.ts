import { z } from 'zod';

export const UpdateUserSchema = z.object({
    username: z
        .string()
        .min(3, 'username must be at least 3 characters long')
        .max(30, 'username must be at most 30 characters long')
        .optional(),

    email: z
        .string()
        .email('email must be a valid email address')
        .optional(),

    password: z
        .string()
        .min(6, 'password must be at least 6 characters long')
        .optional(),

    avatar_url: z
        .string()
        .url('avatar_url must be a valid URL')
        .optional(),
});

export class UpdateUserDto {
    constructor(
        public readonly username?: string,
        public readonly email?: string,
        public readonly password?: string,
        public readonly avatar_url?: string,
    ) { }

    static execute(input: { [key: string]: any }): [string?, UpdateUserDto?] {
        const parseResult = UpdateUserSchema.safeParse(input);

        if (!parseResult.success) {
            const error = parseResult.error.errors[0]?.message ?? 'Validation failed';
            return [error];
        }

        const { username, email, password, avatar_url } = parseResult.data;
        return [undefined, new UpdateUserDto(username, email, password, avatar_url)];
    }
}
