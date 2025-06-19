import { Request, Response } from 'express';
import { CreatorPetPostService } from './services/create-petpost.service';
import { FinderPetPostService } from './services/finder-petpost.service';
import { DeletePetPostService } from './services/delete-petpost.service';
import { UpdatePetPostService } from './services/update-petpost.service';
import { ApprovePetPostService } from './services/approve-petpost.service';
import { RejectPetPostService } from './services/reject-petpost.service';
import { handleError } from '../common/handleError';
import { CreatePetPostDto, UpdatePetPostDto } from '../../domain';


export class PetPostController {
  constructor(
    private readonly creatorPetPostService: CreatorPetPostService,
    private readonly finderPetPostService: FinderPetPostService,
    private readonly deletePetPostService: DeletePetPostService,
    private readonly updatePetPostService: UpdatePetPostService,
    private readonly approvePetPostService: ApprovePetPostService,
    private readonly rejectPetPostService: RejectPetPostService
  ) { }

  createPetPost = (req: Request, res: Response) => {
    const [error, data] = CreatePetPostDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'error',
        message: error,
      });
    }

    this.creatorPetPostService
      .execute(data)
      .then((result) => res.status(201).json(result))
      .catch((error) => handleError(error, res));
  };

  findAllPetPosts = (_req: Request, res: Response) => {
    this.finderPetPostService
      .executeByFindAll()
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  findOnePetPost = (req: Request, res: Response) => {
    const { id } = req.params;

    this.finderPetPostService
      .executeByFindOne(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  deletePetPost = (req: Request, res: Response) => {
    const { id } = req.params;

    this.deletePetPostService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  updatePetPost = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, data] = UpdatePetPostDto.execute(req.body);

    if (error) {
      return res.status(422).json({
        status: 'error',
        message: error,
      });
    }

    this.updatePetPostService
      .execute(id, data)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  approvePetPost = (req: Request, res: Response) => {
    const { id } = req.params;

    this.approvePetPostService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };

  rejectPetPost = (req: Request, res: Response) => {
    const { id } = req.params;

    this.rejectPetPostService
      .execute(id)
      .then((result) => res.status(200).json(result))
      .catch((error) => handleError(error, res));
  };




}
