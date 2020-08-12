const bcrypt = require('bcrypt');
const mysql = require('mysql');
const mySQLInterface = require('../mysql');

class MembershipRouting {
  constructor(app, dbConnex) {
    this.app = app;
    this.dbConnex = dbConnex;
  }

  init() {
    this.app.get('/login.html', (request, response) => {
      // Either give them the app or the login page. Handled in appRouting.
      response.redirect('/');
    });

    this.app.get('/register.html', (request, response) => {
      if (request.session.token) {
        response.redirect('/');
        return;
      }

      response.render('membership/register', {
        session: request.session,
      });
    });

    this.app.post('/auth', (request, response) => {
      const { email } = request.body;
      const { pword } = request.body;

      const callback = (err, results) => {
        if (err) {
          response.send(`There is a great disturbance in the force. I sense ${err} has happened.`);
        } else if (results && results.length === 1) {
          bcrypt.compare(pword, results[0].password, (bcryptErr, res) => {
            if (res) {
              request.session.token = Math.floor(Math.random() * 1000000000000);
              [request.session.user] = results;
            } else {
              request.session.loginerror = 'Wrong username or password. Please try again';
            }
            response.redirect('/');
          });
        } else {
          request.session.loginerror = 'Wrong username or password. Please try again';
          response.redirect('/');
        }
      };
      const where = {
        email: mysql.escape(email),
      };

      mySQLInterface.execQuery(this.dbConnex, callback, 'SELECT', 'users', '*', where);
    });

    this.app.post('/register', (request, response) => {
      // @TODO validate email, verify not already there.
      const { email } = request.body;
      const { pword } = request.body;
      const { pword2 } = request.body;

      if (pword !== pword2) {
        request.session.regerror = 'Passwords do not match; try again.';
        response.redirect('/register.html');
        return;
      }

      // @TODO password strength check

      // Insert new user registration.
      // Error thrown by DB if we have already have somebody with this user id.
      bcrypt.hash(pword, 10, (bcryptErr, hash) => {
        if (hash) {
          const callback = (err) => {
            if (err) {
              // @TODO error view, handling specific errors such as duplicate entries etc.
              response.send(`Oops ${err}<br/><a href="register.html">Click here to try again</a>`);
              response.end();
            } else {
              request.session.welcome = 'Welcome!';
              response.redirect('/');
            }
          };
          const fields = {
            email,
            password: hash,
          };

          mySQLInterface.execQuery(this.dbConnex, callback, 'INSERT', 'users', fields);
        } else {
          // @TODO should have an error view for this as well.
          response.send(`Well hmmm....\n ${bcryptErr} \n Not quite what we expected, now, is it? If the issue persists please let us know.`);
          response.end();
        }
      });
    });
  }
}

module.exports = MembershipRouting;
