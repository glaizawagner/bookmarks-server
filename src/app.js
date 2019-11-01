/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { NODE_ENV } = require('./config');
const bookmarksRouter = require('./bookmarks/bookmarks-router');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

/* Middleware pipeline */
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/bookmarks' ,bookmarksRouter);

/* Authentication handler */
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization') || '';

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: `Unauthorized request to path: ${req.path}` });
  }
  // move to the next middleware
  next();
});


/* Error handler middleware */
app.use(function errorHandler(error, req, res, next) {
  let response;
  console.error(error);
  if(NODE_ENV === 'production'){
    response = { error : { message: 'server error'} };
  } else {
    response = { error : { message: 'server error'} };
  }
  res.status(500).json(response);
});

module.exports = app;