import { FinderUserService } from "./finder-user.service";

export class DeleteUserService {
  constructor(private readonly finderUserService: FinderUserService) { }

  async execute(id: string) {
    const user = await this.finderUserService.executeByFindOne(id);

    user.status = false; // Desactiva al usuario en lugar de eliminarlo

    try {
      await user.save();
      return {
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete user");
    }
  }
}
