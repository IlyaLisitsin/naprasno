const http = require('https');

const { SavedUser } = require('../models');

setInterval(() => http.get('https://buttons-tg-api.herokuapp.com/'), 1000 * 60 * 5);

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

const generateRenderInstance = async function () {
    const usersArr = await SavedUser.find({});

    const [audioArr, avatarArr] = await Promise.all([
        Promise.all(usersArr.map(({ audioUrl}) => httpGet(`https://api.telegram.org/file/bot${process.env.TG_TOKEN}/${audioUrl}`))),
        Promise.all(usersArr.map(({ avatarUrl }) => httpGet(`https://api.telegram.org/file/bot${process.env.TG_TOKEN}/${avatarUrl}`))),
    ]);

    const renderInstance = audioArr.map((audioBuffer, index) => ({
        id: `_${Math.random().toString(36).substr(2, 9)}`,
        audioBuffer,
        avatarBuffer: avatarArr[index],
    }));

    return renderInstance;
};

module.exports = { generateRenderInstance };
