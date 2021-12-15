import express from 'express';
import app from './app';

const PORT = process.env.PORT || 8000;

async function startApp() {
  // Server Init
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Express server listening on port ${PORT}`);
  });
}

startApp();
