const PLUGIN_NAME = "SkeletonPlugin"
const Server = require('./Server')
const Skeleton = require('./Skeleton')
const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')
class SkeletonPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        // 监听done事件完成
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
            await this.startServer()
            this.skeleton = new Skeleton(this.options)
            await this.skeleton.initialize()    // 启动一个无头浏览器
            const skeletonHTML = await this.skeleton.genHTML(this.options.origin)
            // console.log('skeletonHTML', skeletonHTML)
            const originPath = resolve(this.options.staticDir, 'index.html')
            const originHtml = readFileSync(originPath, 'utf8')
            const finalHTML = originHtml.replace('<!-- shell -->', skeletonHTML)
            writeFileSync(originPath, finalHTML)
            await this.skeleton.destroy()
            await this.server.close()
        })
    }
    async startServer() {
        this.server = new Server(this.options)
        await this.server.listen()
    }
}
module.exports = SkeletonPlugin
