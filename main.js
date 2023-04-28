const express = require('express');
const fs = require('fs');
const template = require('./lib/template');
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const auth = require('./lib/auth');
const session = require('express-session');
const FileStore = require('session-file-store')(session);


const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({users:[]}).write();

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

const passport = require('./lib/passport')(app);




const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth')(passport);
app.use('/', indexRouter);
app.use('/topic',topicRouter);
app.use('/auth',authRouter);

app.use((request,response,next)=>{
    response.status(404).send('error');
});

app.use((err, request, response, next)=>{
    response.status(500).send('server error');
});

app.listen(3000);