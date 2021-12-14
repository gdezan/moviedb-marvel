import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

import actorRouter from './routes/actor.route';

import { errorHandler } from './middlewares';

const app = express();
const PORT = process.env.PORT || 8000;

async function startApp() {
  // Swagger
  app.use('/swagger', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  // Routes
  app.use('/actor', actorRouter);

  app.use(errorHandler);

  // Server Init
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Express server listening on port ${PORT}`);
  });
}

startApp();
