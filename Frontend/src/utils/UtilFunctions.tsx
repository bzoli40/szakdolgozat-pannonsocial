import "../App.css";

export const dynamicSort = (property: any) => {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: any, b: any) {
        var a_var = a[property].toString().toLowerCase();
        var b_var = b[property].toString().toLowerCase();

        var result = (a_var < b_var) ? -1 : (a_var > b_var) ? 1 : 0;
        return result * sortOrder;
    }
}

export const first: any = (arr: any, low: any, high: any, x: any, n: any) => {
    if (high >= low) {
        let mid = low + Math.floor((high - low) / 2);

        if ((mid === 0 || x > arr[mid - 1]) && arr[mid] === x)
            return mid;
        if (x > arr[mid])
            return first(arr, (mid + 1), high, x, n);
        return first(arr, low, (mid - 1), x, n);
    }
    return -1;
}

export const sortAccording = (A1: any, A2: any, m: any, n: any) => {

    let temp = [];
    let visited = [];

    for (let i = 0; i < m; i++) {
        temp[i] = A1[i];
        visited[i] = 0;
    }

    temp.sort(function (a, b) { return a - b });

    let ind = 0;

    for (let i = 0; i < n; i++) {

        let f = first(temp, 0, m - 1, A2[i], m);

        if (f === -1) {
            continue;
        }

        for (let j = f; (j < m && temp[j] === A2[i]); j++) {
            A1[ind++] = temp[j];
            visited[j] = 1;
        }
    }

    for (let i = 0; i < m; i++) {
        if (visited[i] === 0)
            A1[ind++] = temp[i];
    }

}

export const stringFormat = (text: string, replacing: string[]) => {

    let temp = text

    for (let x = 0; x < replacing.length; x++) {
        temp = temp.replace(`(${x})`, replacing[x])
    }

    return temp
}

export const stringFormatObject = (text: string, replacing: object[]) => {

    let repSplit = /\[\d*\]/g

    let temp = text.split(repSplit)
    let result = []

    for (let x = 0; x < temp.length; x++) {
        result.push(temp[x])
        if (x < replacing.length) result.push(replacing[x])
    }

    return result
}

export const replaceHungarianCharsPlus = (text: string) => {

    let textNew = text.toString();

    textNew = textNew.replaceAll('ö', 'o')
    textNew = textNew.replaceAll('ó', 'o')
    textNew = textNew.replaceAll('ő', 'o')
    textNew = textNew.replaceAll('ű', 'u')
    textNew = textNew.replaceAll('ü', 'u')
    textNew = textNew.replaceAll('ú', 'u')
    textNew = textNew.replaceAll('é', 'e')
    textNew = textNew.replaceAll('á', 'a')
    textNew = textNew.replaceAll('í', 'i')
    textNew = textNew.replaceAll('?', '')
    textNew = textNew.replaceAll('/', '')
    textNew = textNew.replaceAll(':', '')

    return textNew;
}