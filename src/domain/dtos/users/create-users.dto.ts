import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z
        .string({ required_error: 'name is required' })
        .min(3, 'name must be at least 3 characters long')
        .max(50, 'name must be at most 50 characters long'),

    email: z
        .string({ required_error: 'email is required' })
        .email('email must be a valid email address'),

    password: z
        .string({ required_error: 'password is required' })
        .min(6, 'password must be at least 6 characters long')
        .max(100, 'password must be at most 100 characters long'),
});

export class CreateUserDto {
    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string
    ) { }

    static execute(input: { [key: string]: any }): [string?, CreateUserDto?] {
        const parseResult = CreateUserSchema.safeParse(input);

        if (!parseResult.success) {
            const error = parseResult.error.errors[0]?.message ?? 'Validation failed';
            return [error];
        }

        const { name, email, password } = parseResult.data;
        return [undefined, new CreateUserDto(name, email, password)];
    }
}
