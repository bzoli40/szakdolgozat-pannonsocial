const { Router, response } = require('express');
const router = Router();

const Hirek = require('../database/schemas/Hir');

router.get('/', async (req, res) => {

    try {
        const hirek_lista = await Hirek.find();

        res.status(200).send(hirek_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:hirID/', async (req, res) => {

    const { hirID } = req.params;

    try {
        const hir = await Hirek.findOne({ hirID: hirID });

        res.status(200).send(hir)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { hirID, iro, iro_szervezete, cim, tipus, tartalom, listaKepURL, lathato, hozzakotott_esemeny } = req.body;

    try {

        const most = new Date();

        const ujHir = await Hirek.create({
            hirID,
            iro,
            iro_szervezete,
            letrehozva: most,
            cim,
            tipus,
            tartalom,
            listaKepURL,
            lathato,
            hozzakotott_esemeny
        })

        res.status(200).send(ujHir)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.put('/:hirdbID/', async (req, res) => {

    // Ez nem a HTML-es hirID, ez az adatbázisos
    const { hirdbID } = req.params;

    const { cim, tipus, tartalom, listaKepURL, lathato, iro_szervezete } = req.body;

    try {

        const hir = await Hirek.findById(hirdbID);

        if (cim != undefined)
            hir.cim = cim;
        if (tipus != undefined)
            hir.tipus = tipus;
        if (tartalom != undefined)
            hir.tartalom = tartalom;
        if (listaKepURL != undefined)
            hir.listaKepURL = listaKepURL;
        if (lathato != undefined)
            hir.lathato = lathato == 'true';
        if (iro_szervezete != undefined)
            hir.iro_szervezete = iro_szervezete;

        await hir.save();

        res.status(200).send(hir)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

module.exports = router