const { Router, response } = require('express');
const router = Router();

const Alkatreszek = require('../database/schemas/Alkatresz');
const Anyagigenyek = require('../database/schemas/Anyagigenyek');
const Rekeszek = require('../database/schemas/Rekesz')
const utils = require('../utils')

router.get('/', async (req, res) => {

    try {
        const alkatreszek_lista = await Alkatreszek.find()

        res.send(alkatreszek_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/raktari', async (req, res) => {

    try {
        const alkatreszek_lista = await Alkatreszek.find()

        let alkatreszek_lista_raktari = [];

        for (let x = 0; x < alkatreszek_lista.length; x++) {

            const elerhetoseg = await utils.ElerhetoDarabLekeres(alkatreszek_lista[x]._id);

            alkatreszek_lista_raktari.push(
                {
                    ...alkatreszek_lista[x]._doc,
                    elerheto: elerhetoseg
                });
        }

        res.send(alkatreszek_lista_raktari)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/:alkatresz_id/elerheto', async (req, res) => {

    const { alkatresz_id } = req.params;

    try {
        const elerheto_darab = await utils.ElerhetoDarabLekeres(alkatresz_id);

        res.status(200).send({ elerheto: elerheto_darab })
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.get('/hianyzok', async (req, res) => {

    try {
        const alkatreszek_lista = await Alkatreszek.find()

        const hiany_lista = [];

        for (let x = 0; x < alkatreszek_lista.length; x++) {

            const tartalmazo_rekeszek_lista = await Rekeszek.find({ tarolt_alkatresz: alkatreszek_lista[x]._id })

            if (tartalmazo_rekeszek_lista.length == 0) {
                hiany_lista.push(alkatreszek_lista[x]);
            }

        }

        res.send(hiany_lista)
    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.post('/', async (req, res) => {

    const { nev, egysegar, rekesz_max } = req.body;

    try {

        const intEgysegar = parseInt(egysegar);

        const ujAlkatresz = await Alkatreszek.create(
            {
                nev: nev,
                egysegar: intEgysegar,
                rekesz_max: rekesz_max
            });

        res.status(201).send(ujAlkatresz)

    }
    catch (error) {
        res.send({ msg: error })
    }

});

router.delete('/:alkatresz_id', async (req, res) => {

    const { alkatresz_id } = req.params;
    console.log(alkatresz_id)

    try {

        await Alkatreszek.deleteOne({ _id: alkatresz_id })

        const alkatreszek_lista = await Alkatreszek.find()

        res.send(alkatreszek_lista);

    }
    catch (error) {
        res.send({ msg: error })
    }
});

router.put('/:alkatresz_id/ar', async (req, res) => {

    const { alkatresz_id } = req.params;
    const { uj_ar } = req.query

    try {

        const arInt = parseInt(uj_ar);

        await Alkatreszek.updateOne({ _id: alkatresz_id }, { egysegar: arInt });

        const frissitettAlkatresz = await Alkatreszek.findById(alkatresz_id)

        res.send(frissitettAlkatresz);

    }
    catch (error) {
        res.send({ msg: error })
    }

});

module.exports = router