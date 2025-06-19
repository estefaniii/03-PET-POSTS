import { FinderPetPostService } from './finder-petpost.service';
import { PetPost } from '../../../data';

export class DeletePetPostService {
  constructor(private readonly finderPetPostService: FinderPetPostService) { }

  async execute(id: string) {
    const petPost = await this.finderPetPostService.executeByFindOne(id);

    try {
      await PetPost.remove(petPost); // 🔥 eliminación física

      return {
        message: 'PetPost deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting PetPost:', error);
      throw new Error('Failed to delete PetPost');
    }
  }
}
