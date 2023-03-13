// Beállítja egy cookie értékét
export const setCookie = (name: string, value: any) => {
    document.cookie = `${name}=${value}`
    hasCookie(name)
}

// Visszadja egy cookie értékét
export const getCookie = (name: string) => {
    return getCookies().find(c => c.name === name)?.value
}

// Visszaadja a cookie string-et egy object tömbként
export const getCookies = () => {
    let temp = []
    const cookies = document.cookie.split('; ');

    //Végigmegy a szét'split'elt tömbön és ilyen 'kulcs-érték'-szerűen eltárolja a temp[] tömben
    for (let x = 0; x < cookies.length; x++) {
        const cookieSliced = cookies[x].split('=');
        temp.push({
            name: cookieSliced[0],
            value: cookieSliced[1]
        })
    }

    return temp
}

// Visszadja, hogy van-e ilyen nevű cookie
export const hasCookie = (name: string) => {
    let cookieArray = getCookies();

    return cookieArray.find(c => c?.name === name).value !== '' ? true : false
}

// Reseteli az összes sütit (simán törölni nem lehet JSX/TSX módon)
export const resetCookie = () => {
    let array = getCookies()
    let cookieString = ""

    for (let x = 0; x < array.length; x++) {
        document.cookie = `${array[x].name}=`
    }

    console.log(document.cookie)

    return getCookies()
}

