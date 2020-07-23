const puppeteer = require('puppeteer-cn')
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { sleep } = require('./utils')
class Skeleton {
    constructor(options) {
        this.options = options
    }
    async initialize() {    // 初始化
        this.browser = await puppeteer.launch({ headless: true })
    }
    async newPage() {   // 打开新页面
        let { device } = this.options
        let page = await this.browser.newPage()
        await page.emulate(puppeteer.devices[device])
        return page
    }
    async makeSkeleton(page) {  // 生成骨架屏DOM结构
        const { defer = 5000 } = this.options
        let scriptContent = readFileSync(resolve(__dirname, 'skeletonScript.js'), 'utf8')
        // 通过addScriptTag向页面注入这个脚本
        await page.addScriptTag({ content: scriptContent })
        // 等待脚本执行完成
        await sleep(defer)
        // 脚本执行完成后创建dom结构
        // 在页面种执行此函数
        await page.evaluate((options) => {
            Skeleton.genSkeleton(options)
        }, this.options)
    }
    async genHTML(url) {    // 生成骨架屏的DOM字符串
        let page = await this.newPage()
        let response = await page.goto(url, { waitUntil: 'networkidle2' })
        if (response && !response.ok()) {
            throw new Error(`${response.status} on ${url}`)
        }
        await this.makeSkeleton(page)
        const { html, styles } = await page.evaluate(() => Skeleton.getHtmlAndStyle())
        let result = `
            <style>${styles.join('\n')}</style>
            ${html}
        `
        // console.log('result', result)
        return result
    }
    async destroy() {   // 销毁
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}
module.exports = Skeleton