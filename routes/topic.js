const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const template = require('../lib/template');
const auth = require('../lib/auth');
const db = require('../lib/db');
const shortid = require('shortid');

router.get('/create', (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const title = 'Create';
    const description = '';
    const list = template.list(request.list);
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

router.post('/create' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    const id = shortid.generate();
    const title = post.title;
    const description = post.description;   
    db.get('topics').push({
        id:id,
        title:title,
        description:description,
        user_id:request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});

router.get('/update/:pageId',(request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
        const topic = db.get('topics').find({id:request.params.pageId}).value();
        if(topic.user_id !== request.user.id){
            request.flash('error', 'not yours!');
            return response.redirect('/');
        }
        const title = 'Update';
        const list = template.list(request.list);
        const html = template.html(title,'',list,
        `<form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${topic.id}">
            <p><input type="text" name="title" placeholder="title" value="${topic.title}"></p>
            <p><textarea name="description" placeholder="description">${topic.description}</textarea></p>
            <p><input type="submit" value="update"></p>
        </form>`, auth.statusUI(request,response)   
        );
        response.writeHead(200);
        response.end(html);
});

router.post('/update' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    console.log("post",post);
    const id = post.id;
    const title = post.title;
    const description = post.description;
    const topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'not yours!');
        return response.redirect('/');
    }
    db.get('topics').find({id:id}).assign({
        title:title,
        description:description
    }).write();
    response.redirect(`/topic/${topic.id}`);
});

router.post('/delete' , (request,response)=>{
    if(!auth.is_owener(request,response)){
        response.redirect('/');
        return false;
    }
    const post = request.body;
    const id = post.id;
    const topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'not yours!');
        return response.redirect('/');
    }
    db.get('topics').remove({id:id}).write();
    response.redirect('/');
});

router.get('/:pageId', (request,response,next)=>{
    const topic = db.get('topics').find({id:request.params.pageId}).value();
    console.log("topic", topic);
    // const queryData = url.parse(request.url,true).query;
    const list = template.list(request.list);
    const html = template.html(topic.title,topic.description,list,
    `<a href="/topic/create">CREATE</a>
    <a href="/topic/update/${topic.id}">UPDATE</a>
    <form action="/topic/delete" method="post">
        <p><input type="hidden" name="id" value="${topic.id}"></p>
        <p><input type="submit" value="delete"></p>
    </form>
    `, auth.statusUI(request,response)
    );
    response.send(html);
});

module.exports=router;