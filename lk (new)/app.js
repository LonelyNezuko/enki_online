const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'))
app.use('/api', require('./routes/api/index'))

app.use('/account', require('./routes/pages/account'))
app.use('/messages', require('./routes/pages/messages'))
app.use('/report', require('./routes/pages/report'))

app.use((req, res, next) =>
{
    next(createError(404));
});

app.use((err, req, res, next) =>
{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
