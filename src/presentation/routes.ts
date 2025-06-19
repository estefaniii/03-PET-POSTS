import { Request, Response, Router } from "express";
import { PetPostRoutes } from "./petposts/routes";
import { UserRoutes } from "./users/routes";  // Importar las rutas de usuarios
import { AuthMiddleware } from "./common/middlewares/auth.middleware";
import { UserRole } from "../data";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Rutas de mascotas
    router.use("/api/v1/petposts", PetPostRoutes.routes);
    // Rutas de usuarios
    router.use("/api/v1/users", UserRoutes.routes);  // Añadir ruta de usuarios

    // Puedes agregar más rutas aquí, como la de los doctores si es necesario
    // router.use("/api/v1/doctors", DoctorRoutes.routes);

    return router;
  }
}
