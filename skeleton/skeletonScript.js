window.Skeleton = (function () {
    const CLASS_NAME_PREFIX = 'sk-'
    const SMALLEST_BASE64 = 'data:image/gif;base64,R01GOD1hAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    const $$ = document.querySelectorAll.bind(document)
    const REMOVE_TAGS = ['title', 'meta', 'style', 'script']
    const styleCache = new Map()    // 样式缓存
    // 转换原始元素为骨架DOM元素
    function buttonHandler(element, options = {}) {
        const className = CLASS_NAME_PREFIX + 'button'
        const rule = `{
            color: ${options.color} !important;
            background: ${options.color} !important;
            border: none !important;
            box-shadow: none !important
        }`
        addStyle(`.${className}`, rule)
        element.classList.add(className)
    }
    function imageHandler(element, options = {}) {
        const className = CLASS_NAME_PREFIX + 'image'
        const { width, height } = element.getBoundingClientRect()
        console.log('width', width, 'height', height)
        const attrs = {
            width,
            height,
            src: SMALLEST_BASE64
        }
        setAttributes(element, attrs)
        const rule = `{
            background: ${options.color} !important
        }`
        addStyle(`.${className}`, rule)
        element.classList.add(className)
    }
    function setAttributes(element, attrs) {
        Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]))
    }
    function addStyle(selector, rule) {
        // 保证一个类名只会在缓存中出现一次
        if (!styleCache.has(selector)) {
            styleCache.set(selector, rule)
        }
    }

    function genSkeleton(options) {
        let rootElement = document.documentElement;
        ; (function traverse() {
            const { button, image } = options
            const buttons = []
            const images = [];
            // 深度优先，后序遍历
            ; (function preTravers(element) {
                if (element.children && element.children.length > 0) {
                    Array.from(element.children).forEach(child => preTravers(child))
                }
                if (element.tagName === 'BUTTON') {
                    buttons.push(element)
                } else if (element.tagName === 'IMG') {
                    images.push(element)
                }
            })(rootElement)
            buttons.forEach(item => buttonHandler(item, button))
            images.forEach(item => imageHandler(item, image))
        })(options)
        let rules = ''
        for (const [selector, rule] of styleCache) {
            rules += `${selector} ${rule}\n`
        }
        const styleElement = document.createElement('style')
        styleElement.innerHTML = rules
        document.head.appendChild(styleElement)
    }
    // 获得骨架DOM元素的HTML字符串和样式
    function getHtmlAndStyle() {
        const styles = Array.from($$('style')).map(style => style.innerHTML || style.innerText)
        Array.from($$(REMOVE_TAGS.join(','))).forEach(element => element.parentNode.removeChild(element))
        const html = document.body.innerHTML
        // console.log('styles', styles)
        return { html, styles }
    }
    return { genSkeleton, getHtmlAndStyle }
})()