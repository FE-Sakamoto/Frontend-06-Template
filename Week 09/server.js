const http = require('http')

http.createServer((request, response)=>{
  let body = []
  request
  .on('error', (err)=> {
    console.log(err)
  })
  .on('data', (chunk)=> {
    body.push(chunk.toString())
  })
  .on('end', ()=>{
    body = (Buffer.concat([ Buffer.from(body.toString()) ])).toString();
    console.log('body:', body)
    response.writeHead('200', {'Content-Type': 'text/html'})
    response.end(`<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        #root {
          width: 100vw;
          height: 100vh;
          background-color: lightgray;
        }
        .outter {
          width: 100px;
          height: 100px;
          background-color: lightblue;
        }
        .inner {
          width: 50px;
          height: 50px;
          background-color: lightyellow;
        }
        .text {
          font-size: 24px;
        }
      </style>
      <title>Document</title>
    </head>
    <body>
      <div id="root">
        <div class="outter">
          <div class="inner" />
        </div>
        <div class="outter"></div>
        <div class="text">hello world</div>
        I'm Text Node
      </div>
    </body>
    </html>`)
  })
}).listen(8000)

console.log('serve started')