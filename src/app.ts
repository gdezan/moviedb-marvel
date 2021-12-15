import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';
require('dotenv').config();

import actorRouter from './routes/actor.route';

import { errorHandler } from './middlewares';

const app = express();

// Swagger
app.use('/swagger', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/actor', actorRouter);

app.use(errorHandler);

export default app;
