import https from 'https';

https.get('https://pokeapi.co/api/v2/type/ghost', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data.slice(0, 200) + '...');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
