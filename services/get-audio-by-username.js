const http = require('https');

const { SavedUser } = require('../models');

const httpGet = url => {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            const chunksArray = [];
            let length = 0;
            res.on('data', chunk => {
                chunksArray.push(chunk);
                length += chunk.length;
            });
            res.on('end', () => resolve(Buffer.concat(chunksArray), length));
        }).on('error', reject);
    });
};

const getAudioByUsername = async function (username) {
    const { audioUrl } = await SavedUser.findOne({ username });
    const audioBuffer = await httpGet(`https://api.telegram.org/file/bot${process.env.TG_TOKEN}/${audioUrl}`)

    return audioBuffer;

};

module.exports = { getAudioByUsername };
