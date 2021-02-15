const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const strowbFrameSchema = new Schema({
    image: {type: String, unique: false, required: true},
    caption: {type: String, unique: false, required: false},
    delay: {type: String, unique: false, required: true},
    style: {type: String, unique: false, required: false}
});

const strowbSchema = new Schema({
    userId: {type: String, unique: false, required: true},
    title: {type: String, unique: false, required: false},
    style: {type: String, unique: false, required: false},
    strowb: {type: String, unique: false, required: false},
    frame1: {type: strowbFrameSchema, required: false},
    frame2: {type: strowbFrameSchema, required: false},
    tags: {type: Array, required: false}
});

strowbSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.frame1._id;
        delete ret.frame2._id;
    }
});

module.exports = mongoose.model('Strowb', strowbSchema);
