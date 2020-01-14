const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/buttons', (req, res) => res.render('pages/buttons-list', { buttons: [
          { id: `misha-ratue-${Math.random().toString(36).substr(2, 9)}`, audioSrc: `/buttons-content/misha-ratue.ogg`, avatar: '/buttons-content/misha-ratue.jpg' },
          { id: `andrei-karasique-${Math.random().toString(36).substr(2, 9)}`, audioSrc: '/buttons-content/andrei-karasique.ogg', avatar: '/buttons-content/andrei-karasique.jpg' },
      ] }))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
