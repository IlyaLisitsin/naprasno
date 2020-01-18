const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY,
});

const getAwsDataList = async function () {
    const p1 = new Promise(resolve => {
        s3.listObjectsV2({ Bucket: 'button-audio' }, function(err, data) {
            resolve(data.Contents);
        })
    });

    const p2 = new Promise(resolve => {
        s3.listObjectsV2({ Bucket: 'button-avatar' }, function(err, data) {
            resolve(data.Contents);
        })
    });

    const res = await Promise.all([p1, p2]);

    res[0] = res[0].map(async ({ Key }) => {
        const params = {
            Bucket: 'button-audio',
            Key,
        };

        const contentPromise = new Promise(resolve => {
            s3.getObject(params, function (err, data) {
                if (err) {
                    throw err;
                }
                resolve(data.Body)
            });
        });

        return contentPromise;
    });

    res[1] = res[1].map(async ({ Key }) => {
        const params = {
            Bucket: 'button-avatar',
            Key,
        };

        const contentPromise = new Promise(resolve => {
            s3.getObject(params, function (err, data) {
                if (err) {
                    throw err;
                }
                resolve(data.Body)
            });
        });

        // const content = await contentPromise;
        return contentPromise;
    });

    const audioCollection = await Promise.all(res[0]);
    const avatarCollection = await Promise.all(res[1]);

    return { audioCollection, avatarCollection }

};

module.exports = { getAwsDataList };
