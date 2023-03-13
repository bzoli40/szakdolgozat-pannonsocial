const Anyagigenyek = require('./database/schemas/Anyagigenyek');
const Rekeszek = require('./database/schemas/Rekesz')

const ElerhetoDarabLekeres = async (alkatresz_id) => {

    const azonos_alkatreszt_tarolok = await Rekeszek.find({ tarolt_alkatresz: alkatresz_id })
    const lefoglalo_anyagigenyek = await Anyagigenyek.find({ alkatresz: alkatresz_id, allapot: 1 })

    let raktari_darab = 0;

    azonos_alkatreszt_tarolok.forEach(tarolo => {
        raktari_darab += tarolo.darab
    });

    let lefoglalt_darab = 0;

    lefoglalo_anyagigenyek.forEach(igeny => {
        lefoglalt_darab += igeny.darab
    });

    let elerheto_darab = raktari_darab - lefoglalt_darab

    return elerheto_darab;
}

module.exports = { ElerhetoDarabLekeres }