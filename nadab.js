const glob = require('glob');
const mongoose = require('mongoose');
const chalk = require('chalk');

const config = require('./config/config');

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_DEV);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// Import models
const models = glob.sync(config.root + './src/models/*.js');
models.forEach(function (model) {
  require(model);
});

// Import the app, and initialize it
const app = require('./config/express')();

module.exports = app;

app.listen(config.port, () => {
  if (process.env.NODE_ENV === 'development')
    console.log('Nadab API server listening on port ::' + config.port);
});
