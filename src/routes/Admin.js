const router = require('express').Router();

module.exports = (app) => {
  app.use('/admin/admin', router);
};
