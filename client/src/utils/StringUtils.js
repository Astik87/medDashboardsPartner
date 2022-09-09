/**
 * Обрезать строку и добавить троеточие в конце
 * @param {string} string
 * @param {number} length
 * @return {string|*}
 */
function cutLongString(string, length = 5) {
    if(string.length <= length)
        return string

    return string.slice(0, length) + '...'
}

function randomString(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export {
    cutLongString,
    randomString
}
