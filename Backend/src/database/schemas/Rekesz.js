const mongoose = require('mongoose');

const RekeszSchema = new mongoose.Schema({
    elhelyezkedes: [{
        type: mongoose.SchemaTypes.Number,
        required: true
    }],
    tarolt_alkatresz: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'alkatresz'
    },
    darab: {
        type: mongoose.SchemaTypes.Number
    }
}, { versionKey: false });

module.exports = mongoose.model('rekesz', RekeszSchema, 'rekeszek')