const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

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

function basicDetails(strowb) {
    const {id} = strowb;
    // return { id };
    return strowb;
}

async function create(params) {

    // validate strowb...

    const strowb = new db.Strowb(params);
    //
    // save strowb...
    await strowb.save();

    // fire off image processing here...
    const dir = `./strowb-assets/${strowb.id}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const img1FileData = params.frame1.image.substr(params.frame1.image.indexOf(',') + 1);
    const img2FileData = params.frame2.image.substr(params.frame2.image.indexOf(',') + 1);

    gm(new Buffer.from(img1FileData, 'base64'))
        .toBuffer('webp', (err, buffer1) => {
            fs.writeFile(`${dir}/frame1-${strowb.id}.webp`, buffer1, function (err) {
                if(err) throw err.message;
                console.log("IMG1 ORIG SAVED!");

                gm(new Buffer.from(img2FileData, 'base64'))
                    .toBuffer('webp', function (err, buffer2) {
                        fs.writeFile(`${dir}/frame2-${strowb.id}.webp`, buffer2, function (err) {
                            if(err) throw err.message;
                            console.log("IMG2 ORIG SAVED!");

                            const input = [
                                {"path":`${dir}/frame1-${strowb.id}.webp`, "offset":`+${params.delay}`},
                                {"path":`${dir}/frame2-${strowb.id}.webp`, "offset":`+${params.delay}`}
                            ];

                            const result = webp.webpmux_animate(input,`${dir}/strowb-${strowb.id}.webp`,"0","255,255,255,255");
                            result.then((response) => {
                                console.log(response);
                            });

                        })
                    })
            })
        })

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
