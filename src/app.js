import express from 'express'

import { getScreenUrl } from './service'
import logger from './logger'

const app = express()
export default app

app.get('/:projectId/:screenId.png', async (req, res) => {
    const { projectId, screenId } = req.params

    try {
        const screenUrl = await getScreenUrl(projectId, screenId)
        res.redirect(screenUrl)
    } catch(err) {
        console.log(err)
        logger.error(err.message)
        res.status(400).send(err)
    }
})

