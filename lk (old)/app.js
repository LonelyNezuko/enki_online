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

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

app.use('/register', require('./routes/pages/register'));
app.use('/account', require('./routes/pages/account'));
app.use('/admin', require('./routes/pages/admin'));
app.use('/find', require('./routes/pages/find'));
app.use('/fraction', require('./routes/pages/fraction'));
app.use('/messages', require('./routes/pages/messages'));
app.use('/notf', require('./routes/pages/notf'));
app.use('/recovery', require('./routes/pages/recovery'));
app.use('/report', require('./routes/pages/report'));

app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) =>
{
	if(err.status === 404)return res.render('404NotFound')

	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error', {  message: err.message, status: err.status, stack: err.stack });
});

module.exports = app;
