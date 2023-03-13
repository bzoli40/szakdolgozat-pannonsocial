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
                            title = "Egyetemi hírek";
                            break;
                        case "kari":
                            title = "Kari hírek";
                            break;
                        case "pehok":
                            title = "PEHÖK hírek";
                            break;
                        case "kollegiumi":
                            title = "Kollégiumi hírek";
                            break;
                        case "surgos":
                            title = "Sűrgős hírek";
                            break;
                    }
                    break;
                case "/szerkeszto":
                    title = "Szerkesztő"
                    break;
                case "/esemenyek":
                    title = "Események"
                    break;
            }
        }
        else if (subSiteSliced.length == 3) {
            switch (subSiteSliced[1]) {
                case "hirek":
                    title = "Hír megtekintése"
                    break;
                case "szerkeszto":
                    switch (subSiteSliced[2]) {
                        case "hir":
                            title = "Hírszerkesztő"
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