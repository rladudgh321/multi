const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template');
const auth = require('../lib/auth');

router.get('/', (request,response)=>{
    fs.readdir('./data',(err,filelist)=>{
        const title = 'welcome';
        const description = 'hello world';
        const list = template.list(filelist);
        
        const html = template.html(title,description,list,
        `<a href="/topic/create">CREATE</a>`,
        auth.statusUI(request,response)
        );
        response.send(html);
    });
});

module.exports = router;