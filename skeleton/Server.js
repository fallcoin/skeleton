const express = require('express')
const http = require('http')
class Server {
    constructor(options) {
        this.options = options
    }
    listen() {  // 启动服务
        const app = this.app = express()
        app.use(express.static(this.options.staticDir))
        this.httpServer = http.createServer(app)
        return new Promise(resolve => {
            this.httpServer.listen(this.options.port, () => {
                console.log(`服务已在${this.options.port}端口上启动了`)
                resolve()
            })
        })
    }
    close() {   // 关闭服务
        return new Promise(resolve => {
            this.httpServer.close(this.options.port, () => {
                console.log(`${this.options.port}服务已关闭了`)
                resolve()
            })
        })
    }
}
module.exports = Server