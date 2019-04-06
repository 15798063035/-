const express = require('express')
const router = express.Router()
const article = require('../api/article')
const menu = require('../api/menu')
const word = require('../api/word')
const template = require('art-template');
const path = require('path')

router.get('/getArticle', (req, res) => {
    let articleId = parseInt(req.query.id);
    article.getArticleById(articleId).then(articleInfo => {
        article.getArticleWordsIdByArticleId(articleId).then(wordsId => {
            word.getWordsItemByWordsId(wordsId).then(wordsItem=>{
                var dir = path.join(__dirname, '../views/');
                var html = template( dir + 'wordList.html', {
                    wordsItem,
                    articleId
                });
                html = articleInfo.toString() + html;
                res.end(html);
            })
        })
    })
})

router.get('/addArticle', (req, res) => {
    let menuId = req.query.menuId;
    res.render('addArticle.html', {
        menuId
    })
})

router.post('/addArticle', (req, res) => {
    article.addArticle(req.body).then(articleId => {
        menu.addMenuChildren(req.body.menuId, req.body.title, articleId).then(() => {
            article.getArticleWordById(articleId).then(wordInfo => {
                word.addMoreWords(wordInfo).then(wordsId=>{
                    article.setArticleWordsIdByArticleId(articleId, wordsId).then(()=>{
                        res.redirect('/')
                    })
                })
            })
        })
    })
})

module.exports = router