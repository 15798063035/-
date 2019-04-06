const fs = require('fs')

let _getWordInfo = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./database/word.json', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(data.toString()));
            }
        })
    })
}

let _setWordInfo = function (wordInfo) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./database/word.json', JSON.stringify(wordInfo), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
}

let _getWordItemById = function (wordInfo, wordItemId) {
    for (let i = 0; i < wordInfo.length; i++) {
        if (wordInfo[i].id == wordItemId) {
            return wordInfo[i];
        }
    }
    return null;
}

let _getWordItemByContent = function (wordInfo, content) {
    for (let i = 0; i < wordInfo.length; i++) {
        if (wordInfo[i].content == content) {
            return wordInfo[i];
        }
    }
    return null;
}

let _addOneWord = function (wordInfo, word) {
    let length = wordInfo.length;
    wordItem = _getWordItemByContent(wordInfo, word.content);
    if (!wordItem) {
        let newWordItem = {
            "id": length,
            "click": 1,
            "content": word.content,
            "body": wordInfo.body ? wordInfo.body : "",
            "display": true
        };
        wordInfo.push(newWordItem);
        return length;
    } else {
        wordItem.click = wordItem.click + 1;
        wordItem.body = word.body ? word.body + wordItem.body : wordItem.body
        return wordItem.id;
    }
}

let _setWordItem = function (wordItem) {
    return new Promise((resolve, reject) => {
        _getWordInfo().then(wordInfo => {
            for (let i = 0; i < wordInfo.length; i++) {
                if (wordInfo[i].id == wordItem.id) {
                    wordInfo[i] = wordItem;
                }
            }
            _setWordInfo(wordInfo).then(() => {
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    })
}

let getWordItemById = function (id) {
    return new Promise((resolve, reject) => {
        _getWordInfo().then(wordInfo => {
            for (let i = 0; i < wordInfo.length; i++) {
                if (wordInfo[i].id == id) {
                    resolve(wordInfo[i]);
                }
            }
            resolve(null);
        }).catch(() => {
            reject(err);
        })
    })
}

let getWordsItemByWordsId = function (wordsId) {
    return new Promise((resolve, reject) => {
        _getWordInfo().then(wordInfo => {
            let wordsItem = [];
            for (let i = 0; i < wordsId.length; i++) {
                let wordItem = _getWordItemById(wordInfo, wordsId[i])
                if(wordItem.display){
                    wordsItem.push(wordItem);
                }
            }
            wordsItem.sort(function (item1, item2) {
                return item2.click - item1.click;
            })
            resolve(wordsItem);
        }).catch(err => {
            reject(err)
        })
    })
}

let addMoreWords = function (words) {
    let ids = [];
    return new Promise((resolve, reject) => {
        _getWordInfo().then(wordInfo => {
            for (let i = 0; i < words.length; i++) {
                let id = _addOneWord(wordInfo, words[i])
                ids.push(id);
            }
            _setWordInfo(wordInfo).then(() => {
                resolve(ids);
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            reject(err);
        });
    })
}

let setWordBodyById = function (wordId, body) {
    return new Promise((resolve, reject) => {
        getWordItemById(wordId).then(wordItem => {
            body = body.replace(/"/g, '');
            wordItem.body = body ? body : wordItem.body;
            _setWordItem(wordItem).then(() => {
                resolve();
            }).catch(err => {
                reject(err);
            })
        }).catch(err => {
            reject(err)
        })
    })
}

let deleteWordById = function (wordId) {
    return new Promise((resolve, reject) => {
        _getWordInfo().then(wordInfo=>{
            wordItem = _getWordItemById(wordInfo, wordId);
            wordItem.display = false;
            _setWordItem(wordItem).then(() => {
                resolve()
            }).catch(err => {
                reject(err);
            })
        }).catch(err=>{
            reject(err);
        })
    })
}

module.exports = {
    getWordItemById,
    addMoreWords,
    getWordsItemByWordsId,
    setWordBodyById,
    deleteWordById
}