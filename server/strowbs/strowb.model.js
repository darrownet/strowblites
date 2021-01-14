const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const strowbFrameSchema = new Schema({
    image: {type: String, unique: false, required: true},
    caption: {type: String, unique: false, required: false},
    style: {type: String, unique: false, required: false}
});

const strowbSchema = new Schema({
    userId: {type: String, unique: false, required: true},
    title: {type: String, unique: false, required: false},
    style: {type: String, unique: false, required: false},
    delay: {type: String, unique: false, required: false},
    frame1: {
        type: strowbFrameSchema,
    },
    frame2: {
        type: strowbFrameSchema,
    }
});

strowbSchema.set('toJSON', {
    virtuals: true,
    versionKey: false
});

module.exports = mongoose.model('Strowb', strowbSchema);
