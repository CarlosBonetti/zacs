import puppeteer from 'puppeteer'
import pLimit from 'p-limit'

const USERNAME = process.env.ZEPLIN_USERNAME
const PASSWORD = process.env.ZEPLIN_PASSWORD

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
    await page.close()

    // Get screen IDs with multiple tabs, limiting by a number of concurrent tabs
    const limit = pLimit(4)
    const jobs = screens.map(sid => limit(() => {
        return getArtboardImage(browser, projectId, sid)
            .then(src => result[sid] = src)
    }))
    await Promise.all(jobs)

    await browser.close()
    return result
}

const getArtboardImage = async (browser, projectId, sid) => {
    const page = await browser.newPage()
    await page.goto(`https://app.zeplin.io/project/${projectId}/screen/${sid}`)
    await page.waitForSelector('#screenImage[src]')
    const src = await page.$eval('#screenImage', (elem) => elem.getAttribute('src'))
    if (src === null) {
        await page.screenshot({ path: `screenshots/${sid}.png` })
    }
    await page.close()
    console.log(sid + ': ' + src)
    return src
}

export const getScreen = async (projectId, sid) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Login
    await page.goto(`https://app.zeplin.io/project/${projectId}}`)
    await page.type('[name=handle]', USERNAME)
    await page.type('[name=password]', PASSWORD)
    await page.click('button')
    await page.waitForNavigation()
    
    // Get image
    await page.goto(`https://app.zeplin.io/project/${projectId}/screen/${sid}`)
    await page.waitForSelector('#screenImage[src]')
    const src = await page.$eval('#screenImage', (elem) => elem.getAttribute('src'))
    await page.close()
    await browser.close()
    return src
}
