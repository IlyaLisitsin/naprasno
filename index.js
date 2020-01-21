require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const { generateRenderInstance } = require('./services/gen-render-instance');
const { getAudioByUsername } = require('./services/get-audio-by-username');
const { setupMongoose } = require('./init/setup-mongo');

(async function () {
    await setupMongoose();

    express()
        .use((req, res, next) => {
            res.append('Access-Control-Allow-Origin', ['*']);
            res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        })
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', (req, res) => res.render('pages/index'))
        .get('/buttons', async (req, res) => {

            const renderInstance = await generateRenderInstance();
            res.render('pages/buttons-list', { buttons: JSON.stringify(renderInstance)})
        })
        .get('/buttons/:username', async (req, res) => {
            const { username } = req.params;

            const audio = await getAudioByUsername(username);
            res.json(audio)
        })
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

})();
