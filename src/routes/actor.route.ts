import { Router } from 'express';

import { Validator } from '../middlewares';
import { ActorSchema } from '../schema';
import { ActorController } from '../controllers';

const actorRouter = Router();
const actorController = new ActorController();

actorRouter.get('/', Validator.validate(ActorSchema.getSummary), (req, res, next) =>
  actorController.getSummary(req, res, next),
);

actorRouter.get(
  '/common-characters',
  Validator.validate(ActorSchema.getCommonCharacters),
  (req, res, next) => actorController.getCommonCharacters(req, res, next),
);

export default actorRouter;
