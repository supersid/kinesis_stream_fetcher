'use strict';

let streamConfig  = require('./stream_config.js');

const _     = require('lodash');
const net   = require('net');
const Invoker = require('./../')

const server = net.createServer((connection) => {

    connection.on('end', () => {

        console.log('Client disconnected');
    })

    connection.on('listening', (data) => {

        console.log('Listening...', data);
    })

})


server.listen(9020, () => {
    console.log('Server listening on ', 9020);

    let streamConfig = {
        redisUrl: 'redis://localhost:6379',
        streams: [{
            name: 'development-transaction_events_2',
            partitions: 4
        }]
    }

    let i = new Invoker(streamConfig);
    i.fetch();

    i.on('message', (data) => {
        console.log("+++++++++++++++++++++++++++++++++")
        console.log("+++++++++++++++++++++++++++++++++")
        if(data && data.payload && data.payload.records) {
            _.map(data.payload.records, function(record){
                console.log(new Buffer(record.Data.data).toString('utf8'));
            })
        }
        console.log("+++++++++++++++++++++++++++++++++")
        console.log("+++++++++++++++++++++++++++++++++")
    })
})



