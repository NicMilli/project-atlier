require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const router = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(compression());

// temporary session storage
const sessions = {};

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/products', router.products);
app.use('/reviews', router.reviews);
app.use('/qa', router.questions);
app.use('/cart', router.cart);
app.use('/interactions', router.interactions);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/'));
  // res.send({ message: 'Login successful' })
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports.sessions = sessions;
