import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'
import { Editor } from '@tinymce/tinymce-react';
import { blob } from 'stream/consumers';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import axios from 'axios';
import { OneDayFormatWithTodayCheck } from '../../utils/DateFormatting';

function NewsInspectPage() {

    const [hir, hirBeallit] = useState({});

    let sitePath = window.location.pathname;
    let newsID = sitePath.split('/')[2];

    const getNews2 = async () => {
        await axios.get(`http://localhost:3001/api/hirek/${newsID}`)
            .then(async response => {

                let hirAxios = response.data;

                if (hirAxios.iro_szervezete === '') {
                    await axios.get(`http://localhost:3001/api/felhasznalok/firebase/${hirAxios.iro}`)
                        .then(response => {
                            hirAxios = ({ ...hirAxios, szerzo: response.data.teljes_nev })
                        })
                        .catch(error => console.log(error));
                }

                //console.log(hirAxios)

                hirBeallit({ ...hir, ...hirAxios })
            })
            .catch(error => console.log(error));
    }


    const getNews = async () => {

        const db = getFirestore();
        const q = query(collection(db, "news",), where("creationID", "==", newsID));
        const querySnapshot = await getDocs(q);

        const hirObject = querySnapshot.docs[0];
        var temp = {
            title: hirObject.get("title"),
            creationDate: hirObject.get("creationDate"),
            content: hirObject.get("content")
        };

        //hirBeallit(temp);
    }

    useEffect(() => {
        getNews2()
    }, [])

    useEffect(() => {
        document.getElementById('newsContent').innerHTML = hir['tartalom']
    }, [hir])

    return (
        <div>
            <div id='newsInfos'>
                <div id='creator'>
                    Szerző: {hir['iro_szervezete'] !== '' ? hir['iro_szervezete'] : hir['szerzo']}
                </div>
                <div id='date'>
                    Megjelent: {OneDayFormatWithTodayCheck(new Date(hir['letrehozva']))}
                </div>
            </div>
            <div id='newsContent' />
        </div>
    )
}

export default NewsInspectPage