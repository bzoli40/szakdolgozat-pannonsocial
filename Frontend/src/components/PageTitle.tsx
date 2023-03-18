import React, { useEffect, useState } from 'react'

function PageTitle() {

    let params = new URLSearchParams(window.location.search);
    let subSite = window.location.pathname;

    const [siteTitle, setSiteTitle] = useState("");

    useEffect(() => {
        var title = "";

        var subSiteSliced = subSite.split('/');

        // Oldalcím megadása
        if (subSiteSliced.length == 2) {
            switch (subSite) {
                case "/":
                    title = "Főoldal"
                    break;
                case "/hirek":
                    switch (params.get("type")) {
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
                        case "surgos":
                            title = "Hírek ➜ Sűrgős";
                            break;
                    }
                    break;
                case "/szerkeszto":
                    title = "Szerkesztő ➜ Új hír létrehozása"
                    break;
                case "/esemenyek":
                    title = "Események ➜ Naptár"
                    break;
            }
        }
        else if (subSiteSliced.length == 3) {
            switch (subSiteSliced[1]) {
                case "hirek":
                    title = "Hírek ➜ Hír megtekintése"
                    break;
                case "szerkeszto":
                    switch (subSiteSliced[2]) {
                        case "hir":
                            title = "Szerkesztő ➜ Hírszerkesztő"
                            break;
                    }
                    break;
            }
        }

        setSiteTitle(title);

    }, [window.location.pathname, window.location.search])

    return (
        <span>{siteTitle}</span>
    )
}

export default PageTitle