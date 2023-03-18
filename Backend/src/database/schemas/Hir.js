const mongoose = require('mongoose');

const HirSchema = new mongoose.Schema({
    hirID: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    iro: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'felhasznalo'
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
    fejlecKep: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    listaKep: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    lathato: {
        type: mongoose.SchemaTypes.Boolean,
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('hir', HirSchema, 'hirek')