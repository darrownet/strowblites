const config = require('config.json');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const aws = require('aws-sdk');

const fs = require('fs');
const gm = require('gm');
const webp = require('webp-converter');

module.exports = {
    create,
    // delete: _delete
    // getAll,
    // getById
};


const uploadToS3Bucket = (image, strowb, part) => {
    return new Promise((resolve, reject) => {
        const s3 = new aws.S3({
            signatureVersion: 'v4',
            region: 'us-east-1',
            accessKeyId: 'AKIAJF2IEYUJAVOQWAUQ',
            secretAccessKey: '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'
        });
        const params = {
            'ACL': 'public-read',
            'Bucket': 'strowblites',
            'Key': `${strowb.id}/${part}-${strowb.id}.webp`,
            'Body': image,
            'ContentType': "image/webp",
            'Metadata': {
                'type': 'webp',
                'id': strowb.id,
                'tagging': strowb.tags?.reduce(() => {
                }, '') || '',
                'title': strowb?.title || '',
                'part': part,
                'caption1': strowb.frame1?.caption || '',
                'caption2': strowb.frame2?.caption || '',
                'user-id': strowb.userId
            }
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function create(params) {

    // validate strowb...
    const strowb = new db.Strowb({
        frame1: {
            image: '',
            delay: ''
        },
        frame2: {
            image: '',
            delay: ''
        },
        style: params.style,
        title: params.title,
        userId: params.userId
    });
    //
    // save strowb...
    await strowb.save();

    const paths = {
        assetPrefix: 'https://strowblites.s3.amazonaws.com',
        dir: `./strowb-assets/${strowb.id}`,
        frame1: `./strowb-assets/${strowb.id}/frame1-${strowb.id}.webp`,
        frame2: `./strowb-assets/${strowb.id}/frame2-${strowb.id}.webp`,
        strowb: `./strowb-assets/${strowb.id}/strowb-${strowb.id}.webp`,
    }

    if (!fs.existsSync(paths.dir)) {
        fs.mkdirSync(paths.dir);
    }

    const imageBuff1 = Buffer.from(params.frame1.image.split(";base64,")[1], 'base64');
    const imageBuff2 = Buffer.from(params.frame2.image.split(";base64,")[1], 'base64');

    let strowbData = null;

    await new Promise((resolve, reject) => {
        gm(imageBuff1)
            .write(paths.frame1, (err1) => {
                if (!err1) {
                    gm(imageBuff2)
                        .write(paths.frame2, async (err2) => {
                            if (!err2) {
                                const input = [
                                    {"path": paths.frame1, "offset": `+${params.frame1.delay}`},
                                    {"path": paths.frame2, "offset": `+${params.frame2.delay}`}
                                ];

                                await webp.webpmux_animate(input, paths.strowb, "0", "255,255,255,255");

                                let frame1File = fs.readFileSync(paths.frame1);
                                let frame2File = fs.readFileSync(paths.frame2);
                                let strowbFile = fs.readFileSync(paths.strowb);

                                await uploadToS3Bucket(frame1File, strowb, 'frame1');
                                await uploadToS3Bucket(frame2File, strowb, 'frame2');
                                await uploadToS3Bucket(strowbFile, strowb, 'strowb');

                                fs.unlinkSync(paths.frame1);
                                fs.unlinkSync(paths.frame2);
                                fs.unlinkSync(paths.strowb);
                                fs.rmdirSync(paths.dir);

                                const updateObj = {
                                    frame1: {
                                        caption: params.frame1.caption,
                                        delay: params.frame1.delay,
                                        image: `${paths.assetPrefix}/${paths.frame1}`,
                                        style: params.frame1.style
                                    },
                                    frame2: {
                                        caption: params.frame2.caption,
                                        delay: params.frame2.delay,
                                        image: `${paths.assetPrefix}/${paths.frame2}`,
                                        style: params.frame2.style
                                    },
                                    strowb: `${paths.assetPrefix}/${paths.strowb}`
                                }

                                strowbData = db.Strowb.findByIdAndUpdate(
                                    strowb.id,
                                    updateObj,
                                    {new: true},
                                    () => {
                                        resolve();
                                    }
                                );
                            } else {
                                reject(err2);
                            }
                        });
                } else {
                    reject(err1);
                }
            });
    });

    return strowbData;
}

// async function _delete(id) {
//     const strowb = await getStrowb(id);
//     await strowb.remove();
// }
//
// async function getAll() {
//     const strowbs = await db.Strowb.find();
//     return strowbs.map(x => basicDetails(x));
// }
//
// async function getById(id) {
//     const strowb = await getStrowb(id);
//     return basicDetails(strowb);
// }
//
// async function getStrowb(id) {
//     if (!db.isValidId(id)) throw 'Strowb not found';
//     const strowb = await db.Strowb.findById(id);
//     if (!strowb) throw 'Strowb not found';
//     return strowb;
// }
