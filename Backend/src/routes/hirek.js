const { Router, response } = require('express');
const router = Router();

const Hirek = require('../database/schemas/Hir');

router.get('/', async (req, res) => {

    try {
        const hirek_lista = await Hirek.find({ torolve: false, lathato: true });

        res.status(200).send(hirek_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/szures', async (req, res) => {

    const { kifejezes, szerzo, megjelenes_tol, megjelenes_ig, tipus, esemeny } = req.query;

    try {
        let talalatok = []

        let queryParams = {
            cim: { $regex: new RegExp((kifejezes != undefined ? kifejezes : ''), 'i') },
            iro_szervezete: { $regex: new RegExp((szerzo != undefined ? szerzo : ''), 'i') },
            lathato: true,
            torolve: false
        }

        if (esemeny != undefined)
            queryParams = {
                ...queryParams,
                hozzakotott_esemeny: esemeny
            }

        if (tipus != undefined)
            queryParams = {
                ...queryParams,
                tipus
            }

        if (megjelenes_tol != undefined)
            queryParams = {
                ...queryParams,
                letrehozva: {
                    $gte: megjelenes_tol,
                    $lte: megjelenes_ig,
                }
            }

        //console.log(queryParams)

        talalatok = await Hirek.find(queryParams).sort({ letrehozva: -1 })

        res.status(200).send(talalatok)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/adatbazis/:hirID/', async (req, res) => {

    const { hirID } = req.params;

    try {
        const hir = await Hirek.findById(hirID);

        res.status(200).send(hir)
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

router.get('/felhasznaloi/:felhID/', async (req, res) => {

    const { felhID } = req.params;

    try {
        const hirek_altala = await Hirek.find({ iro: felhID, torolve: false });

        res.status(200).send(hirek_altala)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { hirID, iro, iro_szervezete, cim, tipus, tartalom, listaKepURL, lathato, hozzakotott_esemeny } = req.body;

    try {

        console.log(req.body);
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
            hozzakotott_esemeny: hozzakotott_esemeny != '' ? hozzakotott_esemeny : null
        })

        res.status(200).send(ujHir)
    }
    catch (error) {
        console.log(error)
        res.send({ msg: error })
    }

});

router.put('/:hirdbID/', async (req, res) => {

    // Ez nem a HTML-es hirID, ez az adatbázisos
    const { hirdbID } = req.params;

    const { hirID, iro_szervezete, cim, tipus, tartalom, listaKepURL, lathato, hozzakotott_esemeny } = req.body;

    try {

        const hirElotte = await Hirek.findById(hirdbID);

        await Hirek.updateOne({ _id: hirdbID }, {
            $set: {
                hirID,
                iro_szervezete,
                cim,
                tipus,
                tartalom,
                lathato,
                listaKepURL: listaKepURL != '' ? listaKepURL : hirElotte.listaKepURL,
                hozzakotott_esemeny
            }
        });

        const hir = await Hirek.findById(hirdbID);

        res.status(200).send(hir)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.delete('/:hirID', async (req, res) => {

    const { hirID } = req.params;

    try {
        await Hirek.updateOne({ _id: hirID }, { $set: { torolve: true } });

        res.status(200).send('Hír törölve!')
    }
    catch (error) {
        res.send({ msg: error })
    }

});

// router.put('/up/torlesUpdate/', async (req, res) => {
//     try {
//         console.log('J');
//         await Hirek.updateMany({}, { $set: { torolve: false } });

//         console.log('J');

//         res.status(200).send('Hírek új mezője hozzáadva!')
//     }
//     catch (error) {
//         res.send({ msg: error })
//     }
// });

module.exports = router