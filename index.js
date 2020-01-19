require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const http = require('https');

const { getAwsDataList } = require('./services/get-aws-data-list');
const { generateRenderInstance } = require('./services/gen-render-instance');

const { setupMongoose } = require('./init/setup-mongo');
const { SavedUser } = require('./models');

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

(async function () {
    await setupMongoose();

    express()
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', (req, res) => res.render('pages/index'))
        .get('/buttons', async (req, res) => {
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
            res.render('pages/buttons-list', { buttons: JSON.stringify(renderInstance)})
        })
        .listen(PORT, "0.0.0.0", () => console.log(`Listening on ${ PORT }`));

})();
