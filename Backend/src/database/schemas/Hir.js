const mongoose = require('mongoose');

const HirSchema = new mongoose.Schema({
    hirID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    iro: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    iro_szervezete: {
        type: mongoose.SchemaTypes.String,
        default: ''
    },
    letrehozva: {
        type: mongoose.SchemaTypes.Date,
        required: true
    },
    cim: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    tipus: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    tartalom: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    listaKepURL: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    lathato: {
        type: mongoose.SchemaTypes.Boolean,
        required: true
    },
    hozzakotott_esemeny: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'esemeny'
    },
    torolve: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
        default: false
    }
}, { versionKey: false });

module.exports = mongoose.model('hir', HirSchema, 'hirek')