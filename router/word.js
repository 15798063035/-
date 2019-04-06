const express = require('express')
const router = express.Router()
const word = require('../api/word.js')

router.get('/updateWordBody', (req, res) => {
    let wordId = req.query.wordId;
    let wordBody = req.query.wordBody;
    word.setWordBodyById(wordId, wordBody).then(()=>{
        res.end();
    }).catch(()=>{
        res.end("err");
    })
})

router.get('/deleteWordById', (req, res)=>{
    let wordId = parseInt(req.query.wordId);
    word.deleteWordById(wordId).then(()=>{
        res.end("true");
    }).catch(err=>{
        res.end("false");
    })
})
module.exports = router