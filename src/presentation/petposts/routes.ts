// routes.ts
import { Router } from "express";
import { PetPostController } from "./controller";
import { CreatorPetPostService } from './services/create-petpost.service';
import { FinderPetPostService } from './services/finder-petpost.service';
import { DeletePetPostService } from './services/delete-petpost.service';
import { UpdatePetPostService } from './services/update-petpost.service';
import { ApprovePetPostService } from './services/approve-petpost.service';
import { RejectPetPostService } from './services/reject-petpost.service';
import { AuthMiddleware } from "../common/middlewares/auth.middleware";
import { UserRole } from "../../data";
import { PetPostMiddleware } from "../common/middlewares/petpost.middleware";
import { FinderUserService } from "../users/services/finder-user.service";

export class PetPostRoutes {
  static get routes(): Router {
    const router = Router();
    const finderUserService = new FinderUserService(); // Asumiendo que tienes un servicio para encontrar usuarios
    const createPetPostService = new CreatorPetPostService(finderUserService);
    const finderPetPostService = new FinderPetPostService();
    const deletePetPostService = new DeletePetPostService(finderPetPostService);
    const updatePetPostService = new UpdatePetPostService(finderPetPostService);
    const approvePetPostService = new ApprovePetPostService(finderPetPostService);
    const rejectPetPostService = new RejectPetPostService(finderPetPostService);

    const controller = new PetPostController(
      createPetPostService,
      finderPetPostService,
      deletePetPostService,
      updatePetPostService,
      approvePetPostService,
      rejectPetPostService
    );

    router.get('/', controller.findAllPetPosts);

    router.get("/:id", controller.findOnePetPost);

    // Rutas solo para usuarios autenticados normales
    router.post("/", controller.createPetPost);

    router.use("/:id", AuthMiddleware.protect, PetPostMiddleware.checkOwnershipOrAdmin);
    router.patch("/:id", controller.updatePetPost);
    router.delete("/:id", controller.deletePetPost);



    // Rutas solo para admins
    router.use(AuthMiddleware.protect, AuthMiddleware.restrictTo(UserRole.ADMIN));
    router.patch("/:id/approve", controller.approvePetPost);
    router.patch("/:id/reject", controller.rejectPetPost);
    return router;
  }
}
