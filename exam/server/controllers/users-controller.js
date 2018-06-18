const encryption = require('../utilities/encryption');
const User = require('mongoose').model('User');
const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register');
  },
  registerPost: (req, res) => {
    const { password, repeatPassword, email } = req.body;
    function renderFailedRegister(errorMesage) {
      res.render('users/register', {
        error: errorMesage,
        formData: {
          password,
          repeatPassword,
          email
        }
      });
    }

    if (!password || !repeatPassword || !email) {
      return renderFailedRegister('All fields are required.');
    }

    const isMailValid = emailRegex.test(email);
    if (!isMailValid) {
      return renderFailedRegister('Email must be a vlid one.');
    }

    if (password !== repeatPassword) {
      return renderFailedRegister('Passwords must match.');
    }

    const salt = encryption.generateSalt();
    const hashedPassword = encryption.generateHashedPassword(salt, password);
    
    User.create({
      email: email,
      password: password,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err;
          return res.render('users/register', user);
        }

        return res.redirect('/');
      });
    });
  },
  loginGet: (req, res) => {
    return res.render('users/login');
  },
  loginPost: (req, res) => {
    let reqUser = req.body;
    User
      .findOne({ email: reqUser.email }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data';
          return res.render('users/login');
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data';
          return res.render('users/login');
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err;
            res.render('/login');
          }

          res.redirect('/');
        });
      });
  },
  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  }
};
