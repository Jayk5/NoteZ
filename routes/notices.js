const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateNotice } = require('../middleware');
const notices = require('../controllers/notices');

router.route('/')
    .get(catchAsync(notices.index))
    .post(isLoggedIn, validateNotice, catchAsync(notices.createNotice));

router.get('/new', isLoggedIn, notices.renderNewForm);

router.route('/:id')
    .get(catchAsync(notices.showNotice))
    .put(isLoggedIn, isAuthor, validateNotice, catchAsync(notices.editNotice))
    .delete(isLoggedIn, isAuthor, catchAsync(notices.deleteNotice));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(notices.renderEditForm));

module.exports = router;
