const { Router, response } = require('express');
const router = Router();

const Felhasznalok = require('../database/schemas/Felhasznalo');

router.get('/', async (req, res) => {

    try {
        const felh_lista = await Felhasznalok.find();

        res.status(200).send(felh_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:felhasznaloID', async (req, res) => {

    const { felhasznaloID } = req.params;

    try {
        let felhasznalo = await Felhasznalok.findById(felhasznaloID);

        res.status(200).send(felhasznalo)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:firebaseID/jogok', async (req, res) => {

    const { firebaseID } = req.params;

    try {
        const felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        res.status(200).send(felhasznalo.jogok)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { teljes_nev, email, idFireBase, szervezet } = req.body;

    try {

        const jogok = {
            news_create: false,
            news_edit: false,
            news_delete: false,
            events_create: false,
            events_edit: false,
            events_delete: false
        }

        const ujFelhasznalo = await Felhasznalok.create({
            teljes_nev: teljes_nev,
            email: email,
            jogok: jogok,
            idFireBase: idFireBase,
            szervezet: (szervezet != undefined && szervezet.length > 0) ? szervezet : ""
        })

        res.status(200).send(ujFelhasznalo)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.put('/:firebaseID/jogmodositas', async (req, res) => {
    const { firebaseID } = req.params;
    const frissitendo_jogok = req.body;

    try {
        let felhasznalo = await Felhasznalok.findOne({ idFireBase: firebaseID });

        for (const [jog, ujAllapot] of Object.entries(frissitendo_jogok)) {
            if (felhasznalo.jogok.get(jog) != undefined)
                felhasznalo.jogok.set(jog, ujAllapot == 'true')
            else if (jog == "minden") {
                felhasznalo.jogok.forEach((a2, j2) => {
                    felhasznalo.jogok.set(j2, ujAllapot == 'true')
                })
            }
        }

        await felhasznalo.save();

        res.status(200).send(felhasznalo.jogok)
    }
    catch (error) {
        res.send({ msg: error })
    }
})

module.exports = router