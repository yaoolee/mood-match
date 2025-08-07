// test-https.js
import https from 'https';

https.get('https://pokeapi.co/api/v2/type/electric', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', err => console.error(err));