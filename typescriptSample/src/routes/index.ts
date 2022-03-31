import * as express from 'express';
import appointments from './appointments';

const constructorMethod = (app: express.Application): void => {
  app.use('/appointments', appointments);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export = constructorMethod;
