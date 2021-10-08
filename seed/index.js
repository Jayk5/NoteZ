const mongoose = require('mongoose');
const Notice = require('../models/notice')
const { title, description, author } = require('./data')
mongoose.connect('mongodb://localhost:27017/AppDB', {
    useNewURLParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database Connected");
});

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Notice.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const noti = new Notice({
            owner: '6157541de8eb3292b13e74d6',
            title: `${rand(title)}`,
            description: `${rand(description)}`,
            author: `${rand(author)}`
        })
        await noti.save();
    }
    console.log('mission successful')
}
seedDB().then(() => {
    mongoose.connection.close()
})