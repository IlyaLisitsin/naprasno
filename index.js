require('dotenv').config();
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const { getAwsDataList } = require('./services/get-aws-data-list');
const { generateRenderInstance } = require('./services/gen-render-instance');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/buttons', async (req, res) => {
      const { audioCollection, avatarCollection } = await getAwsDataList();
      res.render('pages/buttons-list', { buttons: JSON.stringify(generateRenderInstance({ audioCollection, avatarCollection }))})
  })
  .listen(PORT, "0.0.0.0", () => console.log(`Listening on ${ PORT }`));
