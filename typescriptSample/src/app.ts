import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const staticFolder = express.static(__dirname + '/../public');

import session from 'express-session';
import configRoutes from './routes';
import { engine } from 'express-handlebars';

/* eslint-disable */
// This is a truly stupid solution, I should find something better
declare module 'express-session' {
  interface Session {
    user: string;
  }
}
/* eslint-enable */

// Nav Bar!
app.use((_req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.navItems = [
    { navTitle: 'Home', navLink: '/' },
    { navTitle: 'Login', navLink: '/users/login' },
	{ navTitle: 'Reviews', navLink: '/reviews/' }
  ];
  next();
});

app.use('/public', staticFolder);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const viewInstance = engine({ defaultLayout: 'main' });

app.engine('handlebars', viewInstance);
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, _res, next) => {
  const ts = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;

  console.log(
    `[${ts}]: ${method} ${route} (${!req.session.user ? 'Non-' : ''
    }Authenticated User)`
  );

  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
