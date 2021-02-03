const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const aws = require('aws-sdk');

const PassThrough = require('stream').PassThrough;

var CombinedStream = require('combined-stream');

const fs = require('fs');
const gm = require('gm');
const concat = require('concat-stream');
const StreamConcat = require('stream-concat');
const FileType = require('file-type');
const webp = require('webp-converter');

module.exports = {
    create,
    // delete: _delete
    // getAll,
    // getById
};


const uploadToS3Bucket = (image, strowb) => {
    console.log(strowb);
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
            'Key': `${strowb.id}/strowb-${strowb.id}.webp`,
            'Body': image,
            'ContentType': "image/webp",
            'x-amz-tagging': strowb.tags?.reduce(()=>{}, '') || '',
            'Metadata': {
                'type': 'webp',
                'id': strowb.id,
                'title': strowb?.title || '',
                'caption1': strowb.frame1?.caption || '',
                'caption2': strowb.frame2?.caption || '',
                'user-id': strowb.userId
            }
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                resolve();
            }
        });
    });
};

function basicDetails(strowb) {
    const {id} = strowb;
    // return { id };
    return strowb;
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

    // fire off image processing here...
    const dir = `./strowb-assets/${strowb.id}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    // const img1FileData = params.frame1.image.substr(params.frame1.image.indexOf(',') + 1);
    // const img2FileData = params.frame2.image.substr(params.frame2.image.indexOf(',') + 1);

    // gm(new Buffer.from(img1FileData, 'base64'))
    //     .toBuffer('webp', (err, buffer1) => {
    //         fs.writeFile(`${dir}/frame1-${strowb.id}.webp`, buffer1, function (err) {
    //             if (err) throw err.message;
    //             console.log("IMG1 ORIG SAVED!");
    //
    //             gm(new Buffer.from(img2FileData, 'base64'))
    //                 .toBuffer('webp', function (err, buffer2) {
    //                     fs.writeFile(`${dir}/frame2-${strowb.id}.webp`, buffer2, function (err) {
    //                         if (err) throw err.message;
    //                         console.log("IMG2 ORIG SAVED!");
    //
    //                         const input = [
    //                             {"path": `${dir}/frame1-${strowb.id}.webp`, "offset": `+${params.frame1.delay}`},
    //                             {"path": `${dir}/frame2-${strowb.id}.webp`, "offset": `+${params.frame1.delay}`}
    //                         ];
    //
    //                         const result = webp.webpmux_animate(input, `${dir}/strowb-${strowb.id}.webp`, "0", "255,255,255,255");
    //                         result.then((response) => {
    //                             console.log(response);
    //                             // upload ${dir} to S3
    //                             // then...
    //                             const updateObj = {
    //                                 frame1: {
    //                                     caption: params.frame1.caption,
    //                                     delay: params.frame1.delay,
    //                                     image: `frame1-${strowb.id}.webp`,
    //                                     style: params.frame1.style
    //                                 },
    //                                 frame2: {
    //                                     caption: params.frame2.caption,
    //                                     delay: params.frame1.delay,
    //                                     image: `frame2-${strowb.id}.webp`,
    //                                     style: params.frame2.style
    //                                 },
    //                                 strowb: `strowb-${strowb.id}.webp`
    //                             }
    //                             db.Strowb.findByIdAndUpdate(strowb.id, updateObj, {new: true}, () => {
    //                                 console.log();
    //                             });
    //                         });
    //
    //                     })
    //                 })
    //         })
    //     })

    // gm(new Buffer(img1FileData)).toBuffer('webp', (err, buffer) => {
    //     console.log(buffer);
    //     fs.writeFile(`${dir}/frame1-${strowb.id}.webp`, buffer, function (err) {
    //         console.log('che');
    //     });
    // });

    // fs.writeFile(dir, new Buffer(img2FileData, 'base64'), () => {
    //     console.log(new Buffer(img2FileData, 'base64'));
    // });

    const inputStr1 = params.frame1.image;
    const inputStr2 = params.frame2.image;


    const imageBuff1 = Buffer.from(inputStr1.split(";base64,")[1], 'base64');
    const imageBuff2 = Buffer.from(inputStr2.split(";base64,")[1], 'base64');

    gm(imageBuff1)
        .write(`${dir}/frame1-${strowb.id}.webp`, function (err1) {
            if (!err1) {
                gm(imageBuff2)
                    .write(`${dir}/frame2-${strowb.id}.webp`, function (err2) {
                        if (!err2) {
                            const input = [
                                {"path": `${dir}/frame1-${strowb.id}.webp`, "offset": `+${params.frame1.delay}`},
                                {"path": `${dir}/frame2-${strowb.id}.webp`, "offset": `+${params.frame2.delay}`}
                            ];
                            webp.webpmux_animate(
                                input,
                                `${dir}/strowb-${strowb.id}.webp`,
                                "0",
                                "255,255,255,255"
                            ).then((response) => {
                                const s3FilePath = fs.readFileSync(`./${dir}/strowb-${strowb.id}.webp`);
                                uploadToS3Bucket(s3FilePath, strowb.id).then(() => {
                                    const updateObj = {
                                        frame1: {
                                            caption: params.frame1.caption,
                                            delay: params.frame1.delay,
                                            image: `frame1-${strowb.id}.webp`,
                                            style: params.frame1.style
                                        },
                                        frame2: {
                                            caption: params.frame2.caption,
                                            delay: params.frame2.delay,
                                            image: `frame2-${strowb.id}.webp`,
                                            style: params.frame2.style
                                        },
                                        strowb: `strowb-${strowb.id}.webp`
                                    }
                                    db.Strowb.findByIdAndUpdate(
                                        strowb.id, updateObj,
                                        {new: true},
                                        () => {}
                                    );
                                });
                            });
                        } else {
                            console.log(err2.log, err2.stack);
                        }
                    });
            } else {
                console.log(err1.log, err1.stack);
            }
        });

    return basicDetails(strowb);
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
