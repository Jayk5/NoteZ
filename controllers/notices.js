const Notice = require('../models/notice');

module.exports.index = async (req, res) => {
    const allNotices = await Notice.find({});
    res.render('notices/index', { allNotices });
}

module.exports.renderNewForm = (req, res) => {
    res.render('notices/new');
}

module.exports.createNotice = async (req, res) => {
    //if (!req.body.notice) throw new ExpressError('Invalid Data', 400);
    const notice = new Notice(req.body.notice);
    notice.owner = req.user._id;
    await notice.save();
    req.flash('success', 'Successfully made a new notice');
    res.redirect(`/notices/${notice._id}`)
}

module.exports.showNotice = async (req, res) => {
    const { id } = req.params;
    const notice = await Notice.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'owner'
        }
    }).populate('owner');
    if (!notice) {
        req.flash('error', 'Cannot find that Notice');
        return res.redirect('/notices');
    }
    res.render('notices/show', { notice })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) {
        req.flash('error', 'Cannot find that Notice');
        return res.redirect('/notices');
    }
    res.render('notices/edit', { notice });
}

module.exports.editNotice = async (req, res) => {
    const { id } = req.params;
    await Notice.findByIdAndUpdate(id, { ...req.body.notice });
    req.flash('success', 'Successfully edited notice');
    res.redirect(`/notices/${id}`);
}

module.exports.deleteNotice = async (req, res) => {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted notice');
    res.redirect('/notices');
}