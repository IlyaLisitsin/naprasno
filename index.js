require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const { generateRenderInstance } = require('./services/gen-render-instance');
const { setupMongoose } = require('./init/setup-mongo');

(async function () {
    await setupMongoose();

    express()
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/', (req, res) => res.render('pages/index'))
        .get('/buttons', async (req, res) => {

            const renderInstance = await generateRenderInstance()
            res.render('pages/buttons-list', { buttons: JSON.stringify(renderInstance)})
        })
        .listen(PORT, () => console.log(`Listening on ${ PORT }`));

})();
