const Notice = require('../models/notice');
const Comment = require('../models/comment')

module.exports.createComment = async (req, res) => {
    const n = await Notice.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.owner = req.user._id;
    n.comments.push(comment);
    await comment.save();
    await n.save();
    req.flash('success', 'Comment posted');
    res.redirect(`/notices/${n._id}`)
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentid } = req.params;
    Notice.findByIdAndUpdate(id, { $pull: { comments: commentid } })
    await Comment.findByIdAndDelete(commentid);
    req.flash('success', 'Comment deleted');
    res.redirect(`/notices/${id}`);
}