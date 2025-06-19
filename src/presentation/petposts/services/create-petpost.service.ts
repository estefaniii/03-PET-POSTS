import { PetPost, PetPostStatus } from '../../../data';
import { FinderUserService } from '../../users/services/finder-user.service';

export class CreatorPetPostService {
  constructor(private finderUserService: FinderUserService) { }

  async execute(data: any) {
    const user = await this.finderUserService.executeByFindOne(data.owner);
    const petPost = new PetPost();
    petPost.pet_name = data.pet_name;
    petPost.description = data.description;
    petPost.image_url = data.image_url || 'https://example.com/default-image.jpg';
    petPost.status = data.status || PetPostStatus.PENDING;
    petPost.user = user;
    petPost.hasfound = data.hasfound || false;

    try {
      await petPost.save();
      return {
        message: 'PetPost created successfully',
      };
    } catch (error) {
      console.error('Error creating PetPost:', error);
      throw new Error('Failed to create PetPost');
    }
  }
}
