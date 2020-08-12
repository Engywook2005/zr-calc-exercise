const bodyParser = require('body-parser');
const express = require('express');
const routing = require('./routing');

const app = express();
const port = process.env.PORT || 8082;

console.log('Starting server.'); // eslint-disable-line no-console

app.use(express.static(`${process.cwd()}/html/public`));
app.use(bodyParser.urlencoded({ extended: true }));

routing.init(app);
app.listen(port);

console.log(`listening on port ${port}`); // eslint-disable-line no-console
