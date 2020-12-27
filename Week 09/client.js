const net = require('net')
const parser = require('./parser')

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body)
    }
    if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
    }
    this.headers['Content-length'] = this.bodyText.length
  }

  send(connection) {
    return new Promise((resolve, reject)=>{
      const parse = new ResponseParser()
      if (connection) {
        connection.write(this.toString())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, ()=> {
          connection.write(this.toString())
        })
      }
      connection.on('data', (data)=>{
        parse.receive(data.toString())
        if (parse.isFinished) {
          resolve(parse.response)
          connection.end()
        }
      })

      connection.on('error', (err)=> {
        reject(err)
        connection.end()
      })
    })
  }

  toString() {
    return (
      `${this.method} ${this.path} HTTP/1.1\r\n` + 
      `${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n` + 
      `\r\n` +
      `${this.bodyText}`
    )
  }
}


const WAITING_STATUS_LINE = 0
const WAITING_STATUS_LINE_END = 1
const WAITING_HEADER_NAME = 2
const WAITING_HEADER_SPACE = 3
const WAITING_HEADER_VALUE = 4
const WAITING_HEADER_LINE_END = 5
const WAITING_HEADER_BLOCK_END = 6
const WAITING_BODY = 7

class ResponseParser {
  
  constructor() {
    this.status = WAITING_STATUS_LINE
    this.statusLine = ''
    this.headerName = ''
    this.headerValue = ''
    this.bodyParser = null
    this.headers = {}
    this.bodyParser = null
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  get isFinished() {
    return !!this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)

    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receiveChar(char) {
    if (this.status === WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.status = WAITING_STATUS_LINE_END
      } else {
        this.statusLine += char
      }
    } else if (this.status === WAITING_STATUS_LINE_END) { 
      if (char === '\n') {
        this.status = WAITING_HEADER_NAME
      }
    } else if (this.status === WAITING_HEADER_NAME) {
      if (char === ':') {
        this.status = WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.status = WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    } else if (this.status === WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.status = WAITING_HEADER_VALUE
      }
    } else if (this.status === WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.status = WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = ''
        this.headerValue = ''
      } else {
        this.headerValue += char
      }
    } else if (this.status === WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.status = WAITING_HEADER_NAME
      }
    } else if (this.status === WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.status = WAITING_BODY
      }
    } else if (this.status === WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

const WAITING_LENGTH = 0
const WAITING_LENGTH_LINE_END = 1
const READING_TRUNK = 2
const WAITING_NEW_LINE = 3
const WAITING_NEW_LINE_END = 4

class TrunkedBodyParser {
  constructor() {
    this.length = 0
    this.content = []
    this.isFinished = false
    this.status = WAITING_LENGTH
  }

  receiveChar(char) {
    if (this.status === WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true
        }
        this.status = WAITING_LENGTH_LINE_END
      } else {
        this.length *= 16
        this.length += parseInt(char, 16)
      }
    } else if (this.status === WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.status = READING_TRUNK
      }
    } else if (this.status === READING_TRUNK) {
      this.content.push(char)
      this.length--
      if (this.length === 0) {
        this.status = WAITING_NEW_LINE
      }
    } else if (this.status === WAITING_NEW_LINE) {
      if (char === '\r') {
        this.status = WAITING_NEW_LINE_END
      }
    } else if (this.status === WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.status = WAITING_LENGTH
      }
    }
  }
}

void async function(){
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8000',
    path: '/',
    headers: {
      'fortune': 'Sometimes when you look into his eyes you get the feeling that someone else is driving.'
    },
    body: {
      name: 'Link',
      weapon: 'Master Sword'
    }
  })

  const response = await request.send()
  const dom = parser.parseHTML(response.body)
}()