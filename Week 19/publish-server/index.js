const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');

function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, (info) => {
    response.write(`<a href="http://localhost:8081/?token=${info.access_token}">publish</a>`);
    response.end();
  });
}

function getToken(code, callback) {
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.344967926310f19b&client_secret=f0d941f58adc84776f2b143a274acb9b9d924e75`,
    port: 443,
    methid: 'POST'
  }, (response) => {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    });
    response.on('end', () => {
      callback(querystring.parse(body));
    });
  });
  request.end();
}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    methid: 'GET',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'toy-publish-FE-Sakamoto'
    }
  }, (response) => {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    });
    response.on('end', chunk => {
      callback(JSON.parse(body));
    });
  });
  request.end();
}

function publish(request, response) {
  const query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  
  getUser(query.token, (info) => {
    if (info.login === 'FE-Sakamoto1') {
      request.pipe(unzipper.Extract({
        path: '../server/public/'
      }));
      request.on('end', () => {
        response.end('Success');
      });
    } else {
      request.on('end', () => {
        response.end('No publish permission');
      });
    }
  });
}


http.createServer((request, response) => {
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }
}).listen(8080);