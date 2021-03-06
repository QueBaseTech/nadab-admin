const router = require('express')
  .Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Admin');

let token = {};

function getToken(req, res, next) {
  if (req.headers['x-token'] || req.query.token) {
    let tok = '';
    if (req.headers['x-token'] !== undefined) tok = req.headers['x-token'];
    if (req.query.token !== undefined) tok = req.query.token;
    jwt.verify(tok, process.env.SESSIONKEY, (error, decode) => {
      if (error) {
        return res.status(404)
          .json({
            success: false,
            message: `We cannot verify your profile ${error.message}`
          });
      }
      token = decode;
    });
  }

  if (token.id === undefined) {
    return res.status(404)
      .json({
        success: false,
        message: 'You are not authorized'
      });
  }
  next();
}

router.get('/', getToken, (req, res) => {
  User.find({ hotel: token.id })
    .then((users) => {
      res.json({
        success: true,
        users
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

// Get specific user
router.get('/:id', getToken, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json({
        success: true,
        user
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

router.post('/add', getToken, (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(404)
      .json({
        success: false,
        message: 'A request body is required'
      });
  }
  const user = new User(req.body);
  bcrypt.hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      user.hotel = token.id;
      return user.save();
    })
    .then((user) => {
      res.json({
        success: true,
        user
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

router.put('/activate/:id', getToken, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      // Negate the current status
      user.isActive = !user.isActive;
      return user.save();
    })
    .then((user) => {
      res.json({
        success: true,
        user
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

router.put('/edit/:id', getToken, (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(404)
      .json({
        success: false,
        message: 'A request body is required'
      });
  }
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      res.json({
        success: true,
        user
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

router.delete('/delete/:id', getToken, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      // Return null user
      res.json({
        success: true,
        user
      });
    })
    .catch((e) => {
      res.status(404)
        .json({
          success: false,
          message: e.message
        });
    });
});

module.exports = (app) => {
  app.use('/admin/users', router);
};
