import express from 'express'

import { getScreenUrl } from './service'
import logger from './logger'

if (!process.env.ZEPLIN_USERNAME || !process.env.ZEPLIN_PASSWORD) {
    throw new Error('You must define ZEPLIN_USERNAME and ZEPLIN_PASSWORD')
    exit(1)
}

const app = express()

app.get('/:projectId/:screenId.png', async (req, res) => {
    const { projectId, screenId } = req.params

    try {
        const screenUrl = await getScreenUrl(projectId, screenId)
        res.redirect(screenUrl)
    } catch(err) {
        logger.error(err)
        res.status(400).send(err)
    }
})

app.listen(process.env.PORT || 3000, () => {
    logger.info('Listening on port 3000')
})
