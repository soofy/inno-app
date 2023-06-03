const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const config = {
    name: 'sample-express-app',
    port: 3001,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

const shapes = ['RECTANGLE', 'CIRCLE', 'LINE', 'TRIANGLE'];
const colors = ['red', 'orange','blue', 'green', 'yellow', 'indigo' , 'violet'];

app.get('/', (req, res) => {
    res.status(200).send('hello world');
});


app.get('/api/shapes', (req, res) => {

    let currShape =  req.params.current;
    while(currShape ===  req.params.current){
        currShape = shapes[Math.floor(Math.random()*shapes.length)];
    }
    res.status(200).send(currShape);
});

app.get('/api/colors', (req, res) => {
    let currColor =  req.params.current;
    while(currColor ===  req.params.current){
        currColor = colors[Math.floor(Math.random()*colors.length)];
    }
    res.status(200).send(currColor);
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
