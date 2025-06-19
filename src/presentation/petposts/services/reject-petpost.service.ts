import { FinderPetPostService } from './finder-petpost.service';
import { PetPostStatus } from '../../../data';

export class RejectPetPostService {
    constructor(private readonly finderPetPostService: FinderPetPostService) { }

    async execute(petPostId: string) {
        const petPost = await this.finderPetPostService.executeByFindOne(petPostId);

        if (!petPost) {
            throw new Error('PetPost not found');
        }

        petPost.status = PetPostStatus.REJECTED;
        await petPost.save();

        return {
            message: 'PetPost rejected'
        };
    }
}
