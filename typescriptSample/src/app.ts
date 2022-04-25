import express from 'express';
const app = express();
const staticFolder = express.static(__dirname + '/../public');

import configRoutes from './routes';
import { engine } from 'express-handlebars';

app.use('/public', staticFolder);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewInstance = engine({ defaultLayout: 'main' });

app.engine('handlebars', viewInstance);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
