const { noticeSchema, commentSchema } = require('./utils/validSchemas');
const ExpressError = require('./utils/ExpressError')
const Notice = require('./models/notice');
const Comment = require('./models/comment')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice.owner.equals(req.user._id)) {
        req.flash('error', 'Permission denied!');
        return res.redirect(`/notices/${id}`);
    }
    next();
}

module.exports.validateNotice = (req, res, next) => {
    const { error } = noticeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentid } = req.params;
    const comment = await Comment.findById(commentid);
    if (!comment.owner.equals(req.user._id)) {
        req.flash('error', 'Permission denied!');
        return res.redirect(`/notices/${id}`);
    }
    next();
}