import puppeteer from 'puppeteer'
import pLimit from 'p-limit'

import config from './config'
import logger from './logger'

/**
 * Retrieve all artboard images from a zeplin project.
 *
 * @param projectId The ID of the project to retrieve images from.
 * @return A map of screenIds and its PNG image as value.
 */
const getArtboardImages = async (projectId) => {
    const result = {}
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(config.CRAWLER_TIMEOUT)

    // Login
    await page.goto(`https://app.zeplin.io/project/${projectId}}`)
    await page.type('[name=handle]', config.ZEPLIN_USERNAME)
    await page.type('[name=password]', config.ZEPLIN_PASSWORD)
    await page.click('button')
    await page.waitForNavigation()

    // Get screen ids
    const screens = await page.$$eval('.screen', (elems) => elems.map(elem => elem.getAttribute('data-id')))
    logger.debug(`Found ${screens.length} screens`)
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

/**
 * Retrieve a single screen image.
 *
 * @param browser A puppeteer browser instance already logged in.
 * @param projectId The ID of the projecto to retrieve the image from.
 * @param sid The screen ID.
 * @return The image URL of the screen.
 */
const getArtboardImage = async (browser, projectId, sid) => {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(config.CRAWLER_TIMEOUT)

    await page.goto(`https://app.zeplin.io/project/${projectId}/screen/${sid}`)
    await page.waitForSelector('#screenImage[src]')
    const src = await page.$eval('#screenImage', (elem) => elem.getAttribute('src'))
    if (src === null) {
        await page.screenshot({ path: `screenshots/${sid}.png` })
    }
    await page.close()
    logger.debug(sid + ': ' + src)
    return src
}

/**
 * Retrieve a single artboard image from a zeplin project.
 *
 * @param projectId The project ID to retrieve the artboard image from.
 * @param sid The screen ID.
 * @return The image URL of the screen.
 */
export const getScreen = async (projectId, sid) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(config.CRAWLER_TIMEOUT)

    // Login
    await page.goto(`https://app.zeplin.io/project/${projectId}`)
    await page.type('[name=handle]', config.ZEPLIN_USERNAME)
    await page.type('[name=password]', config.ZEPLIN_PASSWORD)
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
