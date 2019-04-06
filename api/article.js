const fs = require('fs')

let _getArticleInfo = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./database/article.json', 'utf8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        })
    })
}


let _setArticleInfo = function (articleInfo) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./database/article.json', JSON.stringify(articleInfo), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

let _getArticleItemById = function (articleId) {
    return new Promise((resolve, reject) => {
        _getArticleInfo().then(articleInfo => {
            for (let i = 0; i < articleInfo.length; i++) {
                if (articleInfo[i].id == articleId) {
                    resolve(articleInfo[i]);
                }
            }
            resolve(null);
        }).catch(err => reject(err))
    })
}

let _setArticleItemById = function(articleId, articleItem){
    return new Promise((resolve, reject) => {
        _getArticleInfo().then(articleInfo => {
            for (let i = 0; i < articleInfo.length; i++) {
                if (articleInfo[i].id == articleId) {
                    articleInfo[i] = articleItem;
                }
            }
            _setArticleInfo(articleInfo).then(()=>{
                resolve(null);
            }).catch(err=>{
                reject(err);
            })
        }).catch(err => reject(err))
    })
}

let getArticleById = function (id) {
    return new Promise((resolve, reject) => {
        _getArticleItemById(id).then(itemInfo => {
            let url = itemInfo.content_url;
            fs.readFile(url, 'utf8', function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    })
}

let getArticleWordById = function (articleId) {
    return new Promise((resolve, reject) => {
        getArticleById(articleId).then(data => {
            let word = [];
            let result = [];
            let wordInfo = [];
            data = data.toString().replace(/<.*>/g, "");
            data = data.replace(/"|“|”|'|‘|’|\.|,|\(|\)|:|；|，|：/g, ' ');
            word = data.split(/\s/)
            word.sort();
            for(let i=0; i<word.length; i++){
                let value = word[i];
                if (value != ' ') {
                    if (result.indexOf(value) == -1) {
                        result.push(value);
                        let item = {
                            "content": value,
                            "name": ''
                        }
                        wordInfo.push(item)
                    }
                }
            }
            resolve(wordInfo)
        }).catch(err => {
            reject(err)
        })
    })
}

let _addArticleItem = function (title, content_url) {
    return new Promise((resolve, reject) => {
        _getArticleInfo().then(articleInfo => {
            let articleItem = {};
            articleItem.title = title;
            articleItem.content_url = content_url;
            articleItem.id = articleInfo.length;
            articleInfo.push(articleItem);
            _setArticleInfo(articleInfo).then(() => {
                resolve(articleItem.id)
            }).catch(err => reject(err))
        })
    })
}

let addArticle = function (form) {
    return new Promise((resolve, reject) => {
        let title = form.title;
        let body = form.body;
        let time = new Date().getTime();
        let url = './article/' + form.menuId + '/' + title + time + '.txt';
        fs.writeFile(url, body.toString(), function (err, data) {
            if (err) {
                reject(err)
            } else {
                _addArticleItem(title, url).then(id => {
                    resolve(id)
                }).catch(err => reject(err))
            }
        })
    })
}

let setArticleWordsIdByArticleId = function(articleId, wordsId){
    return new Promise((resolve, reject)=>{
        _getArticleItemById(articleId).then(articleItem=>{
            articleItem.wordsId = wordsId;
            _setArticleItemById(articleId, articleItem).then(()=>{
                resolve()
            }).catch(err=>{
                reject(err);
            })
        })
    })
}

let getArticleWordsIdByArticleId = function(articleId){
    return new Promise((resolve, reject)=>{
        _getArticleItemById(articleId).then(articleItem=>{
            resolve(articleItem.wordsId)
        }).catch(err=>{
            reject(err);
        })
    })
}

let deleteWordById = function(articleId, wordId){
    return new Promise((resolve, reject)=>{
        _getArticleItemById(articleId).then(articleItem=>{
            let wordsId = articleItem.wordsId;
            for(let i=0; i<wordsId.length; i++){
                if(wordId == wordsId[i]){
                    wordsId.splice(i,1);
                }
            }
            _setArticleItemById(articleId, articleItem).then(()=>{
                resolve();
            }).catch(err=>{reject(err)});
        }).catch(err=>{reject(err)});
    })
}

module.exports = {
    getArticleById,
    getArticleWordById,
    addArticle,
    setArticleWordsIdByArticleId,
    getArticleWordsIdByArticleId,
    deleteWordById
}