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
    response.end(' Hello world\n')
  })
}).listen(8000)

console.log('serve started')