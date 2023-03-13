const mongoose = require('mongoose');

const AnyagigenyekSchema = new mongoose.Schema({
    megrendeles: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'megrendeles'
    },
    alkatresz: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'alkatresz'
    },
    darab: {
        type: mongoose.SchemaTypes.Number
    },
    allapot: {
        type: mongoose.SchemaTypes.Number
    }
    // 0 - nincs lefoglalva | 1 - lefoglalva de nincs kivéve | 2 - kivéve
}, { versionKey: false });

module.exports = mongoose.model('anyagigeny', AnyagigenyekSchema, 'anyagigenyek');