const fs = require('fs')

let _getMemu = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./database/menu.json', 'utf8', function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

let _setMenu = function (menuInfo) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./database/menu.json', JSON.stringify(menuInfo), function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

let _getMemuItemById = function(id){
    return new Promise((resolve, reject)=>{
        _getMemu().then(menuInfo=>{
            for(let i=0; i<menuInfo.length; i++){
                if(menuInfo[i].id == id){
                    resolve(menuInfo[i])
                }
            }
            reject(null);
        }).catch(err=>reject(err))
    })
}

let _updateMenuItem = function(menuItem){
    return new Promise((resolve, reject)=>{
        _getMemu().then(menuInfo=>{
            for(let i=0; i<menuInfo.length; i++){
                if(menuInfo[i].id == menuItem.id){
                    menuInfo[i].children = menuItem.children;
                    _setMenu(menuInfo).then(()=>{
                        resolve()
                    }).catch(err=>reject(err))
                }
            }
        })
    })
}

let addMenu = function (nemuName) {
    return new Promise((resolve, reject) => {
        _getMemu().then(menuInfo => {
            let length = menuInfo.length;
            menuItem = {
                title: nemuName,
                id: length,
                children: []
            };
            menuInfo.push(menuItem);
            _setMenu(menuInfo).then(()=>{
                resolve(length)
            }).catch(err=>reject(err))
        }).catch(err => reject(err))
    })
}

let addMenuChildren = function(menuId, title, articleId){
    return new Promise((resolve, reject)=>{
        _getMemuItemById(menuId).then(menuItem=>{
            let childrenItem = {
                title: title,
                id: articleId
            };
            menuItem.children.push(childrenItem);
            _updateMenuItem(menuItem).then(()=>{
                resolve()
            }).catch(err=>reject(err))
        }).catch(err=>reject(err))
    })
}

module.exports = {
    addMenu,
    addMenuChildren
}