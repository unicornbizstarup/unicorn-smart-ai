const net = require('net');

const port = 5433;
const host = '127.0.0.1';

const client = new net.Socket();
client.setTimeout(2000);

client.connect(port, host, () => {
    console.log(`Connection to ${host}:${port} SUCCESSFUL`);
    client.end();
    process.exit(0);
});

client.on('error', (err) => {
    console.error(`Connection to ${host}:${port} FAILED:`, err.message);
    client.destroy();
    process.exit(1);
});

client.on('timeout', () => {
    console.error(`Connection to ${host}:${port} TIMEOUT`);
    client.destroy();
    process.exit(2);
});
