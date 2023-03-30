const { Router, response } = require('express');
const router = Router();

const Ertesitesek = require('../database/schemas/Ertesites');

router.get('/', async (req, res) => {

    try {
        const ertesitesek_lista = await Ertesitesek.find();

        res.status(200).send(ertesitesek_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:firebaseID/', async (req, res) => {

    const { firebaseID } = req.params;

    try {
        const felh_ertesitesek_lista = await Ertesitesek.find({ ertesitett: firebaseID });

        res.status(200).send(felh_ertesitesek_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:ertesitesID/elolvas', async (req, res) => {

    const { ertesitesID } = req.params;

    try {
        const ertesites = await Ertesitesek.findById(ertesitesID);

        ertesites.latott = true;
        await ertesites.save();

        res.status(200).send(ertesites)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { ertesitett, tartalom, linkelt_dok, linkelt_tipusa } = req.body;

    try {

        const ujErtesites = await Ertesitesek.create({
            ertesitett: ertesitett,
            tartalom: tartalom,
            linkelt_dok: linkelt_dok,
            linkelt_tipusa: linkelt_tipusa
        })

        res.status(200).send(ujErtesites)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

module.exports = router