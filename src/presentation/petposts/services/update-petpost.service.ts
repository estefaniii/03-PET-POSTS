import { FinderPetPostService } from './finder-petpost.service';

export class UpdatePetPostService {
  constructor(private readonly finderPetPostService: FinderPetPostService) { }

  async execute(id: string, data: any) {
    const petPost = await this.finderPetPostService.executeByFindOne(id);

    petPost.pet_name = data.pet_name ?? petPost.pet_name;
    petPost.description = data.description ?? petPost.description;
    petPost.image_url = data.image_url ?? petPost.image_url;
    petPost.status = data.status ?? petPost.status;
    petPost.hasfound = data.hasfound ?? petPost.hasfound;

    try {
      await petPost.save();
      return {
        message: 'PetPost updated successfully',
      };
    } catch (error) {
      console.error('Error updating PetPost:', error);
      throw new Error('Failed to update PetPost');
    }
  }
}
