import { FinderUserService } from "./finder-user.service";

export class UpdateUserService {
  constructor(private readonly finderUserService: FinderUserService) { }

  async execute(id: string, data: any) {
    const user = await this.finderUserService.executeByFindOne(id);

    user.name = data.name;
    user.email = data.email;
    user.password = data.password; // Asegúrate de cifrar la contraseña antes de guardar
    user.role = data.role;
    user.status = data.status;

    try {
      await user.save();
      return {
        message: "User updated successfully",
      };
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }
}
