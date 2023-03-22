const mongoose = require('mongoose');

const EsemenySchema = new mongoose.Schema({
    megnevezes: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    tipus: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    leiras: {
        type: mongoose.SchemaTypes.String
    },
    kezdes: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    vege: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    helyszin: {
        type: mongoose.SchemaTypes.String
    },
    oraKell: {
        type: mongoose.SchemaTypes.Boolean,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('esemeny', EsemenySchema, 'esemenyek')