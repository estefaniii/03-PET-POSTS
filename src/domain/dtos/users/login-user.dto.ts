import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email.' })
    .email('The email address is badly formatted.'),

  password: z
    .string({ required_error: 'Please enter your password.' })
    .min(8, 'Your password must have 8 characters or more.'),
});

export class LoginUserDto {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) { }

  static execute(input: { [key: string]: any }): [string?, LoginUserDto?] {
    const parseResult = LoginUserSchema.safeParse(input);

    if (!parseResult.success) {
      const error = parseResult.error.errors[0]?.message ?? 'Validation failed';
      return [error];
    }

    const { email, password } = parseResult.data;
    return [undefined, new LoginUserDto(email, password)];
  }
}
