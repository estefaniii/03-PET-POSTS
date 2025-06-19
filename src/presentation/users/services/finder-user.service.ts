import { User } from "../../../data";

export class FinderUserService {
  async executeByFindAll() {
    const users = await User.find({
      where: {
        status: true, // Puedes filtrar usuarios activos según el estado
      },
    });
    return users;
  }

  async executeByFindOne(id: string) {
    console.log('Executing FinderUserService with id:', id);
    const user = await User.findOne({
      where: {
        id,
        status: true, // Solo busca usuarios activos
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
