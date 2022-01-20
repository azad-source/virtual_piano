const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

const wsServer = new WebSocket.Server({ server });

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.resolve(__dirname, 'front', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

wsServer.on('connection', (ws) => {
    ws.on('message', (msg) => {
        msg = new TextDecoder('utf-8').decode(msg);
        wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });
    ws.send('Добро пожаловать!');
});

server.listen(80, () => console.log('Server started'));
