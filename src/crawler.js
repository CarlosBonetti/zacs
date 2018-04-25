const puppeteer = require('puppeteer')

const USERNAME = 'bonetti@bridge.ufsc.br'
const PASSWORD = 'XXXX'

const sismob = '55bbd2cebcebcc33197f6551'
const pec = '5a291aadc25bad024132423a'

const getArtboardImages = async (projectId) => {
    const result = {}
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Login
    await page.goto(`https://app.zeplin.io/project/${projectId}}`)
    await page.type('[name=handle]', USERNAME)
    await page.type('[name=password]', PASSWORD)
    await page.click('button')
    await page.waitForNavigation()

    // Get screen ids
    const screens = await page.$$eval('.screen', (elems) => elems.map(elem => elem.getAttribute('data-id')))
    console.log(`Found ${screens.length} screens`)

    // Get each screen
    for (let sid of screens) {
        await page.goto(`https://app.zeplin.io/project/${projectId}/screen/${sid}`)
        await page.waitForSelector('#screenImage[src]')
        const src = await page.$eval('#screenImage', (elem) => elem.getAttribute('src'))
        if (src === null) {
            await page.screenshot({ path: `screenshots/${sid}.png` })
        }
        console.log(sid + ': ' + src)
        result[sid] = src
    }

    await browser.close()
    return result
}

(async () => {
    const result = await getArtboardImages(pec)
    console.log(result)
})()
