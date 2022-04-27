import * as express from 'express';
import appointments from './appointments';
import reviews from './reviews';
import users from './users';

const constructorMethod = (app: express.Application): void => {
  app.use('/appointments', appointments);
  app.use('/reviews', reviews);
  app.use('/users', users);

  app.get('/', (_, res) => {
    res.render('home', { title: "C'est La Vie Salon" });
  });

  app.get('/login')

  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export = constructorMethod;
