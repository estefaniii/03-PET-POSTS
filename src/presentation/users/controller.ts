import { Request, Response } from "express";
import { CreatorUserService } from "./services/create-user.service";
import { FinderUserService } from "./services/finder-user.service";
import { DeleteUserService } from "./services/delete-user.service";
import { UpdateUserService } from "./services/update-user.service";
import { LoginUserService } from "./services/login-user.service";
import { handleError } from '../common/handleError';
import { CreateUserDto, UpdateUserDto } from '../../domain';
import { LoginUserDto } from "../../domain/dtos/users/login-user.dto";

export class UserController {
  constructor(
    private readonly creatorUserService: CreatorUserService,
    private readonly finderUserService: FinderUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly loginUserService: LoginUserService
  ) { }

  createUser = (req: Request, res: Response) => {
    const [error, data] = CreateUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'error',
        message: error,
      });
    }

    this.creatorUserService
      .execute(data)
      .then((result) => res.status(201).json(result))
      .catch((error) => handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, data] = LoginUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({ message: error });
    }

    this.loginUserService
      .execute(data!)
      .then((result) => {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 3 * 60 * 60 * 1000, // 3 horas
        });
        res.status(200).json(result);
      })
      .catch((error) => handleError(error, res));
  };


  findAllUsers = (req: Request, res: Response) => {
    this.finderUserService
      .executeByFindAll()
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderUserService
      .executeByFindOne(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.deleteUserService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, data] = UpdateUserDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'error',
        message: error,
      });
    }

    this.updateUserService
      .execute(id, data)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    console.log('Validando cuenta');
    console.log(token);
    this.creatorUserService
      .validateAccount(token)
      .then((message) => res.status(201).json({ message }))
      .catch((error) => handleError(error, res));
  };

}
