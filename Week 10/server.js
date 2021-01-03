const http = require('http')
const fs = require('fs')

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
    response.writeHead('200', {'Content-Type': 'text/html'})
    response.end(fs.readFileSync('./index.html', 'utf-8'))
  })
}).listen(8000)

console.log('serve started')