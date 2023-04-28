const express = require('express');
const router = express.Router();
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const template = require('../lib/template');

module.exports = function(passport){

    const authData = {
        email : "egoing777@gmail.com",
        pwd : "111",
        nickname : "egoing"
    }

    router.get('/login', (request,response)=>{
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        console.log("feedback",feedback);
        fs.readdir('./data',(err,filelist)=>{
            const title = 'Log-in';
            const description = '';
            const list = template.list(filelist);
            const html = template.html(title,description,list,
            ` <div style="color:red;">${feedback}</div>
            <form action="/auth/login" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="pwd" placeholder="password"></p>
                <p><input type="submit" value="Log-in"></p>
            </form>`    
            );
            response.writeHead(200);
            response.end(html);
        });
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash : true
    }));

    /*
    router.post('/login', (request,response)=>{
        const post = request.body;
        const email = post.email;
        const pwd = post.pwd;
        if(email === authData.email && pwd === authData.pwd){
            request.session.is_logined = true;
            request.session.nickname = authData.nickname;
            request.session.save(()=>{
                response.redirect('/');
            });
        } else {
            response.send('who?');
        }
    });
    */

    router.get('/logout', (request,response)=>{
        request.session.destroy((err)=>{
            response.redirect('/');
        })
    });

    /*
    router.get('/create', (request,response)=>{
        fs.readdir('./data',(err,filelist)=>{
            const title = 'Create';
            const description = '';
            const list = template.list(filelist);
            const html = template.html(title,description,list,
            `<form action="/topic/create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`    
            );
            response.writeHead(200);
            response.end(html);
        });
    });

    router.post('/create' , (request,response)=>{
        const post = request.body;
        const title = post.title;
        const description = post.description;
        fs.writeFile(`./data/${title}`,description,'utf-8',err=>{
            response.writeHead(302,{Location:`/topic/${title}`});
            response.end();
        });
    });

    router.get('/update/:pageId',(request,response)=>{
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
                </form>`    
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });

    router.post('/update' , (request,response)=>{
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
        const post = request.body;
        const id = post.id;
        fs.unlink(`./data/${id}`,err=>{
            response.writeHead(302,{Location:`/`});
            response.end();
        });
    });

    router.get('/:pageId', (request,response)=>{
        fs.readdir('./data',(err,filelist)=>{
            const filtered = path.parse(request.params.pageId).base;
            fs.readFile(`./data/${filtered}`,'utf-8',(err,description)=>{
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
                `  
                );
                response.send(html);
            });
        });
    });
    */
    return router;
}
