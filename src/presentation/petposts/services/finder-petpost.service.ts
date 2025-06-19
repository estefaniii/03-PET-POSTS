import { PetPost, PetPostStatus } from '../../../data';

export class FinderPetPostService {
  async executeByFindAll() {
    const petPosts = await PetPost.find({
      where: {
        status: PetPostStatus.APPROVED,
        hasfound: false
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    return petPosts;
  }

  async executeByFindOne(id: string) {
    const petPost = await PetPost.createQueryBuilder('petPost')
      .leftJoinAndSelect('petPost.user', 'user')
      .select([
        'petPost',
        'user.id',
        'user.name',
        'user.email',
        'user.role',
        'user.status'
      ])
      .where('petPost.id = :id', { id })
      .getOne();

    if (!petPost) {
      throw new Error('PetPost not found');
    }

    return petPost;
  }


}
