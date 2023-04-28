const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const template = require('../lib/template');
const auth = require('../lib/auth');


router.get('/create', (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    fs.readdir('./data',(err,filelist)=>{
        const title = 'Create';
        const description = '';
        const list = template.list(filelist);
        const html = template.html(title,description,list,
        `<form action="/topic/create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
            <p><input type="submit" value="create"></p>
        </form>`, auth.statusUI(request,response)    
        );
        response.writeHead(200);
        response.end(html);
    });
});

router.post('/create' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    const title = post.title;
    const description = post.description;
    fs.writeFile(`./data/${title}`,description,'utf-8',err=>{
        response.writeHead(302,{Location:`/topic/${title}`});
        response.end();
    });
});

router.get('/update/:pageId',(request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    fs.readdir('./data',(err,filelist)=>{
        const filtered = path.parse(request.params.pageId).base;
        fs.readFile(`./data/${filtered}`,'utf-8',(err,description)=>{
            const title = 'Update';
            const list = template.list(filelist);
            const html = template.html(title,'',list,
            `<form action="/topic/update" method="post">
                <input type="hidden" name="id" value="${filtered}">
                <p><input type="text" name="title" placeholder="title" value="${filtered}"></p>
                <p><textarea name="description" placeholder="description">${description}</textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`, auth.statusUI(request,response)   
            );
            response.writeHead(200);
            response.end(html);
        });
    });
});

router.post('/update' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`./data/${id}`,`./dtaa/${title}`,err=>{
        fs.writeFile(`./data/${title}`,description,'utf-8',(err,result)=>{
            response.writeHead(302,{Location:`/topic/${title}`});
            response.end();
        });
        
    });
});

router.post('/delete' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    const id = post.id;
    fs.unlink(`./data/${id}`,err=>{
        response.writeHead(302,{Location:`/`});
        response.end();
    });
});

router.get('/:pageId', (request,response,next)=>{
    fs.readdir('./data',(err,filelist)=>{
        const filtered = path.parse(request.params.pageId).base;
        fs.readFile(`./data/${filtered}`,'utf-8',(err,description)=>{
            if(err){
                next(err);
            } else {
                // const queryData = url.parse(request.url,true).query;
                const title = filtered;
                const list = template.list(filelist);
                const html = template.html(title,description,list,
                `<a href="/topic/create">CREATE</a>
                <a href="/topic/update/${title}">UPDATE</a>
                <form action="/topic/delete" method="post">
                    <p><input type="hidden" name="id" value="${title}"></p>
                    <p><input type="submit" value="delete"></p>
                </form>
                `, auth.statusUI(request,response)
                );
                response.send(html);
            }
        });
    });
});

module.exports=router;