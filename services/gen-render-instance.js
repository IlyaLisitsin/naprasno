const http = require('https');

setInterval(() => http.get('https://buttons-tg-api.herokuapp.com/'), 1000 * 60 * 5);

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY,
    signatureVersion: 'v4',
    region: 'ap-northeast-2',
});

const signedUrlExpireSeconds = 60 * 60 * 24;

const generateRenderInstance = async function () {
    const [audioUrlCollection, avatarUrlCollection] = await Promise.all([
        new Promise(resolve => s3.listObjectsV2({ Bucket: 'button-audio' }, function(err, data) {
            if (err) console.log(err);
            else {
                resolve(Promise.all(data.Contents.map(content => {
                return new Promise(resolve => {
                    s3.getSignedUrl('getObject', {
                        Bucket: 'button-audio',
                        Key: content.Key,
                        Expires: signedUrlExpireSeconds,
                    }, function (err, url) {
                        resolve(url)
                    })
                })
            })))
            }
        })),
        new Promise(resolve => s3.listObjectsV2({ Bucket: 'button-avatar' }, function(err, data) {
            if (err) console.log(err);
            else {
                resolve(Promise.all(data.Contents.map(content => {
                return new Promise(resolve => {
                    s3.getSignedUrl('getObject', {
                        Bucket: 'button-avatar',
                        Key: content.Key,
                        Expires: signedUrlExpireSeconds,
                    }, function (err, url) {
                        resolve(url)
                    })
                })
            })))
            }
        }))
    ]);

    const renderInstance = audioUrlCollection.map((audioUrl, index) => ({
        id: `_${Math.random().toString(36).substr(2, 9)}`,
        audioBuffer: audioUrl,
        avatarBuffer: avatarUrlCollection[index],
    }));

    return renderInstance;
};

module.exports = { generateRenderInstance };

