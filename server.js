const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 80 });

server.on('connection', (ws) => {
    ws.on('message', (msg) => {
        msg = new TextDecoder('utf-8').decode(msg);
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg);
            }
        });
    });
    ws.send('Добро пожаловать!');
});
