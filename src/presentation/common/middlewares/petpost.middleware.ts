import { Request, Response, NextFunction } from "express";
import { PetPost } from "../../../data/postgres/models/petpost.model"; // Ajusta según tu estructura
import { User } from "../../../data/postgres/models/user.model";
import { UserRole } from "../../../data";

export class PetPostMiddleware {
    static async checkOwnershipOrAdmin(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const user = (req as any).sessionUser as User;


        try {
            const petPost = await PetPost.findOne({
                where: { id },
                relations: ['user'], // 👈 aquí le dices a TypeORM que también cargue la relación con el usuario
            });


            if (!petPost) {
                return res.status(404).json({ message: "Publicación no encontrada" });
            }

            // Si es el dueño o es admin, sigue
            if (petPost.user.id === user.id || user.role === UserRole.ADMIN) {
                return next();
            }

            return res.status(403).json({ message: "No tienes permiso para esta acción" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
