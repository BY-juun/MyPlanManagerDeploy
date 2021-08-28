const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const morgan = require('morgan');
const db = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');

const userRouter = require('./routes/user');
const dayRouter = require('./routes/day');
const planRouter = require('./routes/plan');

dotenv.config();
const app = express();

db.sequelize.sync()
    .then(() => {
        console.log("db연결 성공");
    })
    .catch((err) => {
        console.error(err);
    })

passportConfig();

app.use(cors({
    origin: true,
    credentials: true, //이걸 해줘야 cookie도 같이 보낼 수 있다.
}));


app.use(morgan('dev'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
        httpOnly: true, //cookie는 javascript로 조작할 수 없도록.
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRouter);
app.use('/day', dayRouter);
app.use('/plan', planRouter);


app.get('/', (req, res) => {
    res.send("Plan Manager");
})

app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });
  
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

app.listen(3060, () => {
    console.log("서버 실행 중");
})
