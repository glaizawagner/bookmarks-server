const express =require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

/* Bookmark routes */
bookmarksRouter
  .route('/')
  .get((req, res) => {
  res.json(bookmarks);
});

bookmarksRouter
  .route('/')
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    //if title don't exist
    if (!title) {
      logger.error('Title is required');
      return res.status(400).send('Invalid data');
    }
    //if url don't exist
    if (!url) {
      logger.error('URL is required');
      return res.status(400).send('Invalid data');
    }
    //if rating don't exist
    if(!rating) {
      logger.error('Rating is required');
      return res.status(400).send('Invalid data');
    }
    //if they exist
    const id = uuid();
  
    const bookmark = { id, title, url, description, rating};
  
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created`);
    res.status(201).location(`http://localhost:8000/card/${id}`).json(bookmark);
  });
  

bookmarksRouter
  .route('/:bookmarkId')
  .get((req, res) => {
    const { bookmarkId } = req.params;
    const bookmark = bookmarks.find(bMark => bMark.id == bookmarkId);
  
    // make sure we found a bookmark
    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmarkId} not found.`);
      return res.status(404).send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })

  .delete((req, res) => {
    const { bookmarkId } = req.params;

    const bookmarkIndex = bookmarks.findIndex(bMark => bMark.id == bookmarkId);
    
    //checking if bookmark index exist
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmarkId} not found.`);
      return res.status(404).send('Not found');
    }

    //remove bookmark from bookmarks
    bookmarks.splice(bookmarkIndex, 1);
    logger.info(`Bookmark with id ${bookmarkId} deleted.`);
    res.status(204).send(`Bookmark with id ${bookmarkId} deleted.`).end();
 });

module.exports = bookmarksRouter;