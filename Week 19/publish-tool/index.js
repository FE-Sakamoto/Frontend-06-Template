const http = require('http');
const archiver = require('archiver');
const child_process = require('child_process');
const querystring = require('querystring');

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.344967926310f19b`);

http.createServer((request) => {
  const query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
  publish(query.token);
}).listen(8081);

function publish(token) {
  const request = http.request({
    hostname: '127.0.0.1',
    port: 8080,
    method: 'POST',
    path: `/publish?token=${token}`,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }, () => {
    console.log('finish');
  });

  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });
  
  archive.directory('./files/', false);
  archive.finalize();
  archive.pipe(request);

  request.end();
}