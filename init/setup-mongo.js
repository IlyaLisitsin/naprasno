const mongoose = require('mongoose');

function setupMongoose() {
    return new Promise(resolve => {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
            .then(() => {
                resolve();
                console.log('Mongo connection established');
            });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongo connection lost. Trying to reconnect');
            mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
        });
    })
}

module.exports = { setupMongoose };
