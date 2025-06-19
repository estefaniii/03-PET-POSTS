import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config';
import { User, UserRole } from '../../../data/postgres/models/user.model';

export class AuthMiddleware {

  static async protect(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) {
        return res.status(401).json({ message: 'Invalid Token!' });
      }

      const user = await User.findOne({
        where: {
          id: payload.id,
          status: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid user' });
      }

      // ✅ Guardamos el usuario en una propiedad personalizada
      (req as any).sessionUser = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went very wrong 😢' });
    }
  }

  static restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const sessionUser = (req as any).sessionUser;

      if (!sessionUser || !roles.includes(sessionUser.role)) {
        return res.status(403).json({
          message: 'You are not authorized to access this route',
        });
      }

      next();
    };
  };

}
