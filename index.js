const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const Blob = require('fetch-blob');
const stream = require('stream');

const atob = require('atob');


const fs = require('fs');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: 'AKIAJEGX3AMT2RJW4WGA',
    secretAccessKey: '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'
});

const params = {
    Bucket: 'button-audio',
    Key: 'kek.ogg', // File name you want to save as in S3
};

const params1 = {
    Bucket: 'button-audio',
    Key: 'kek1.ogg', // File name you want to save as in S3
};

const params2 = {
    Bucket: 'button-audio',
    Key: 'kek2.ogg', // File name you want to save as in S3
};

const params3 = {
    Bucket: 'button-audio',
    Key: 'kek3.ogg', // File name you want to save as in S3
};

const params4 = {
    Bucket: 'button-audio',
    Key: 'kek4.ogg', // File name you want to save as in S3
};

var arr = [params, params1, params2, params3, params4]

var promiseArr = arr.map(para => new Promise(resolve => {
    s3.getObject(para, function(err, data) {
        if (err) {
            throw err;
        }
        resolve(data.Body)
    });
}))

// Promise.all(promiseArr).then(console.log)

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/buttons', (req, res) => {
      s3.getObject(params3, (err, data) => {

          res.render('pages/buttons-list', { buttons: JSON.stringify([
                  { id: `misha-ratue-${Math.random().toString(36).substr(2, 9)}`, audioBuffer: data.Body, avatar: '/buttons-content/misha-ratue.jpg' },
                  // { id: `andrei-karasique-${Math.random().toString(36).substr(2, 9)}`, audioSrc: '/buttons-content/andrei-karasique.ogg', avatar: '/buttons-content/andrei-karasique.jpg' },
              ]) })
      })
  })
  .listen(PORT, "0.0.0.0", () => console.log(`Listening on ${ PORT }`));
// const kek = Buffer.from('kek')
// const kak = Buffer.from('kok')
//
// var res = Buffer.concat([kek, kak], kek.length + kak.length)
//
// console.log(1, res)
//
// var json = JSON.stringify(res)
//
// var newBuff = new Buffer(JSON.parse(json).data)
//
//
// console.log(2, newBuff)
