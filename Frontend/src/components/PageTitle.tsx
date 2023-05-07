import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../store';
import { setLoad } from '../slices/loadingSlice';

function PageTitle() {

    const dispatch = useAppDispatch();

    let params = new URLSearchParams(window.location.search);
    let subSite = window.location.pathname;

    const [siteTitle, setSiteTitle] = useState("");

    useEffect(() => {
        dispatch(setLoad(true));
        titleFromURL();
    }, [window.location.pathname, window.location.search])

    const titleFromURL = async () => {
        var title = "";

        var subSiteSliced = subSite.split('/');

        // Oldalcím megadása
        if (subSiteSliced.length == 2) {
            switch (subSite) {
                case "/":
                    title = "Főoldal"
                    break;
                case "/hirek":
                    switch (params.get("tipus")) {
                        case "egyetemi":
                            title = "Hírek ➜ Egyetemi";
                            break;
                        case "kari":
                            title = "Hírek ➜ Kari";
                            break;
                        case "pehok":
                            title = "Hírek ➜ PEHÖK";
                            break;
                        case "kollegiumi":
                            title = "Hírek ➜ Kollégiumi";
                            break;
                        default:
                            title = 'Hírek ➜ Mind'
                            break;
                    }
                    if (params.get("esemeny") != null) {
                        title = 'Hírek ➜ Eseményhez kapcsolódó'
                    }
                    break;
                case "/esemenyek":
                    title = "Események ➜ Naptár"
                    break;
                case "/szerkeszto":
                    title = "Szerkesztői felület ➜ Opció választó"
                    break;
            }
        }
        else if (subSiteSliced.length == 3) {
            switch (subSiteSliced[1]) {
                case "hirek":

                    await axios.get(`http://localhost:3001/api/hirek/${subSiteSliced[2]}`)
                        .then(response => {

                            const hir = response.data;

                            let cimEleje = hir.tipus == 'egyetemi' ? 'Egyetemi hírek' :
                                hir.tipus == 'kari' ? 'Kari hírek' :
                                    hir.tipus == 'pehok' ? 'PEHÖK hírek' :
                                        hir.tipus == 'kollegiumi' ? 'Kollégiumi hírek' : 'Hírek';

                            title = cimEleje + " ➜ " + hir.cim;
                        })
                        .catch(error => console.log(error));
                    break;
                case "szerkeszto":
                    switch (subSiteSliced[2]) {
                        case "hir":
                            title = "Szerkesztő ➜ Új hír"
                            break;
                        case "esemeny":
                            title = "Szerkesztő ➜ Új esemény"
                            break;
                    }
                    break;
            }
        }
        else if (subSiteSliced.length == 4) {
            switch (subSiteSliced[1]) {
                case "szerkeszto":
                    switch (subSiteSliced[2] + "/" + subSiteSliced[3]) {
                        case "hir/modositas":
                            title = "Szerkesztő ➜ Hír módosítása"
                            break;
                        case "esemeny/modositas":
                            title = "Szerkesztő ➜ Esemény módosítása"
                            break;
                    }
                    break;
            }
        }

        setSiteTitle(title);
        dispatch(setLoad(false));
    }

    return (
        <span>{siteTitle}</span>
    )
}

export default PageTitle