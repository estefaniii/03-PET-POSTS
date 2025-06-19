import { z } from 'zod';
import { PetPostStatus } from '../../../data';

export const CreatePetPostSchema = z.object({
  pet_name: z
    .string({ required_error: 'pet_name is required' })
    .min(3, 'pet_name must be at least 3 characters long')
    .max(50, 'pet_name must be at most 50 characters long'),

  description: z
    .string({ required_error: 'description is required' })
    .min(10, 'description must be at least 10 characters long'),

  image_url: z
    .string({ required_error: 'image_url is required' })
    .url('image_url must be a valid URL'),

  owner: z
    .string({ required_error: 'owner is required' })
    .min(3, 'owner must be at least 3 characters long'),

  status: z
    .nativeEnum(PetPostStatus)
    .optional() // opcional porque puede quedar en default: pending

  ,

  hasfound: z
    .boolean()
    .optional() // opcional porque puede quedar como default: false
});

export class CreatePetPostDto {
  constructor(
    public readonly pet_name: string,
    public readonly description: string,
    public readonly image_url: string,
    public readonly owner: string,
    public readonly status: PetPostStatus = PetPostStatus.PENDING,
    public readonly hasfound: boolean = false
  ) { }

  static execute(input: { [key: string]: any }): [string?, CreatePetPostDto?] {
    const parseResult = CreatePetPostSchema.safeParse(input);

    if (!parseResult.success) {
      const error = parseResult.error.errors[0]?.message ?? 'Validation failed';
      return [error];
    }

    const { pet_name, description, image_url, owner, status, hasfound } = parseResult.data;
    return [undefined, new CreatePetPostDto(
      pet_name,
      description,
      image_url,
      owner,
      status ?? PetPostStatus.PENDING,
      hasfound ?? false
    )];
  }
}
