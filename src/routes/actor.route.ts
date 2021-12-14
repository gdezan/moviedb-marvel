import { Router } from 'express';

import { Validator } from '../middlewares';
import { ActorSchema } from '../schema';
import { ActorController } from '../controllers';

const actorRouter = Router();

actorRouter.get('/', Validator.validate(ActorSchema.get), ActorController.movies);

export default actorRouter;
