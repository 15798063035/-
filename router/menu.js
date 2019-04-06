const express = require('express')
const router = express.Router()
const fs = require('fs')
const menu = require('../api/menu.js')

router.get('/addmenu', (req, res) => {
    var menuName = req.query.menuName;
    menuName = menuName.toString().replace(/\s|'|"|‘|’|“|”/g,'')
    menu.addMenu(menuName).then(menuId=>{
        let dirName = './article/'+menuId;
        fs.mkdir(dirName,function(err,data){
            if(err){
                res.end("err")
            }else{
                res.end('ok')
            }
        })
    }).catch(err=>{
        res.end('err')
    })
})
module.exports = router