import { Router } from 'express';

import { ActorController } from '../controllers';

const actorRouter = Router();

actorRouter.get('/', ActorController.get);

export default actorRouter;
