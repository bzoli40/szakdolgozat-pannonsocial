import React, { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where, getFirestore } from 'firebase/firestore'
import { Editor } from '@tinymce/tinymce-react';
import { blob } from 'stream/consumers';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function NewsInspectPage() {

    const [hir, hirBeallit] = useState({
        title: "",
        creationDate: "",
        content: ""
    });

    let sitePath = window.location.pathname;
    let newsID = sitePath.split('/')[2];

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

        hirBeallit(temp);
    }

    useEffect(() => {
        getNews()
    }, [])

    useEffect(() => {
        document.getElementById('newsContent').innerHTML = hir.content
    }, [hir])

    return (
        <div id='contentPlace'>
            <div id="newsTitle">
                {hir.title}
            </div>
            <div className='line-horizontal' />
            <div id='newsContent' />
        </div>
    )
}

export default NewsInspectPage