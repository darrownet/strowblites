const db = require('_helpers/db');
const aws = require('aws-sdk');

const fs = require('fs');
const gm = require('gm');
const webp = require('webp-converter');

module.exports = {
    create,
    // delete: _delete
    // getById
    // getAllByUserId
    // getMarquee
};


function uploadToS3Bucket(fileData, strowb, part, ext = 'webp') {
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
            'Key': `${strowb.id}/${part}.${ext}`,
            'Body': fileData,
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
        userId: params.userId
    });
    //
    // save strowb...
    await strowb.save();

    const paths = {
        assetPrefix: 'https://strowblites.s3.amazonaws.com',
        dir: `./strowb-assets/${strowb.id}`,
        frame1: `./strowb-assets/${strowb.id}/frame1.webp`,
        frame2: `./strowb-assets/${strowb.id}/frame2.webp`,
        strowb: `./strowb-assets/${strowb.id}/strowb.webp`,
        strowbGif: `./strowb-assets/${strowb.id}/strowb.gif`,
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
                                    {"path": paths.frame1, "offset": `+${params.frame1.delay/10}`},
                                    {"path": paths.frame2, "offset": `+${params.frame2.delay/10}`}
                                ];

                                await webp.webpmux_animate(input, paths.strowb, "0", "255,255,255,255");

                                await new Promise((resolve, reject) => {
                                    gm()
                                        .in(paths.frame1)
                                        .in(paths.frame2)
                                        .delay(Number(params.frame1.delay)/10)
                                        .write(paths.strowbGif, function(err){
                                            if (err) {
                                                console.log(err);
                                                reject();
                                            } else {
                                                resolve();
                                            }
                                            console.log("animated.gif created");
                                        });
                                });

                                let frame1File = fs.readFileSync(paths.frame1);
                                let frame2File = fs.readFileSync(paths.frame2);
                                let strowbFile = fs.readFileSync(paths.strowb);
                                let strowbGif = fs.readFileSync(paths.strowbGif);

                                await uploadToS3Bucket(frame1File, strowb, 'frame1');
                                await uploadToS3Bucket(frame2File, strowb, 'frame2');
                                await uploadToS3Bucket(strowbFile, strowb, 'strowb');
                                await uploadToS3Bucket(strowbGif, strowb, 'strowbGif', 'gif');

                                fs.unlinkSync(paths.frame1);
                                fs.unlinkSync(paths.frame2);
                                fs.unlinkSync(paths.strowb);
                                fs.unlinkSync(paths.strowbGif);
                                fs.rmdirSync(paths.dir);

                                const updateObj = {
                                    frame1: {
                                        delay: params.frame1.delay,
                                        image: `${paths.assetPrefix}/${strowb.id}/frame1.webp`,
                                    },
                                    frame2: {
                                        delay: params.frame2.delay,
                                        image: `${paths.assetPrefix}/${strowb.id}/frame2.webp`,
                                    },
                                    strowb: `${paths.assetPrefix}/${strowb.id}/strowb.webp`,
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
