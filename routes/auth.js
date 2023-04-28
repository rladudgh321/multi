const express = require('express');
const router = express.Router();
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const template = require('../lib/template');
const shortid = require('shortid');
const db = require('../lib/db');
const bcrypt =require('bcrypt');

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
            const title = 'Log-in';
            const description = '';
            const list = template.list(request.list);
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
        request.logout(err=>{
            if(err){
                return next(err);
            }
            response.redirect('/');
        });
    });

    router.get('/register', (request,response)=>{
        const fmsg = request.flash();
        let feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        console.log("feedback",feedback);
            const title = 'Register';
            const description = '';
            const list = template.list(request.list);
            const html = template.html(title,description,list,
            ` <div style="color:red;">${feedback}</div>
            <form action="/auth/register" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="pwd" placeholder="password"></p>
                <p><input type="password" name="pwd2" placeholder="password2"></p>
                <p><input type="text" name="displayName" placeholder="displayName"></p>
                <p><input type="submit" value="Register"></p>
            </form>`    
            );
            response.writeHead(200);
            response.end(html);
    });
   
    router.post('/register', (request,response,next)=>{
        const post = request.body;
        const email = post.email;
        const pwd = post.pwd;
        const pwd2 = post.pwd2;
        const displayName = post.displayName;
        if(pwd !== pwd2){
            request.flash('error', 'pwd is not same');
            response.redirect('/auth/register');
            return false;
        } else {
            bcrypt.hash(pwd, 1, (err,hash)=>{
                const user = {
                    id:shortid.generate(),
                    email:email,
                    pwd : hash,
                    displayName:displayName
                }
                db.get('users').push(user).write();
                request.login(user, err=>{
                    if(err){
                        next(err);
                    }
                    response.redirect('/');
                });
            });
        }
    });

    return router;
}
