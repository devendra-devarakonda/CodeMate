import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'YqrhNRr9wR0V2s6v3RsYkdlidbQCia6e',
    socket: {
        host: 'redis-17667.c330.asia-south1-1.gce.redns.redis-cloud.com',
        port: 17667
    }
});


client.on('connect', () => console.log('Redis Client Connected'));

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)

export default client;