const express = require('express');
const chalk = require('chalk');
const fs = require('fs');
const {createProxyMiddleware} = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const devMock = require('@medux/dev-utils/dist/express-middleware/dev-mock');
const prodServer = require('@medux/dev-utils/dist/express-middleware/prod-server');

const htmlTpl = fs.readFileSync('./index.html', 'utf8');
// eslint-disable-next-line import/no-unresolved
const {proxy, server, mock} = require('./env.json');

const app = express();
const [, , port] = server.split(/:\/*/);

app.use('/client', express.static('./client', {fallthrough: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(devMock(mock, proxy, true));
app.use('/api', createProxyMiddleware(proxy['/api/**']));
app.use(prodServer(htmlTpl));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red Demo Server} on {green ${server}/} \n`));
