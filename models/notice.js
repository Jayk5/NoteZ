const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const NoticeSchema = new Schema({
    title: String,
    description: String,
    author: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
    {
        timestamps: true
    });

NoticeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Notice', NoticeSchema);