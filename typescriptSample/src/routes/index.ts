import * as express from 'express';
import appointments from './appointments';
import reviews from './reviews';

const constructorMethod = (app: express.Application): void => {
  app.use('/appointments', appointments);

  app.use('/reviews', reviews);

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export = constructorMethod;
