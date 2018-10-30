import express from 'express'

import { getScreenUrl, getProjectData } from './service'
import logger from './logger'

const app = express()
export default app

app.get('/api/:projectId', async (req, res) => {
    const { projectId } = req.params

    try {
        const apiData = await getProjectData(projectId)
        res.json(apiData)
    } catch(err) {
        logger.error(err.message)
        res.status(400).send(err)
    }
})

app.get('/:projectId/:screenId.png', async (req, res) => {
    const { projectId, screenId } = req.params

    try {
        const screenUrl = await getScreenUrl(projectId, screenId)

        if (!screenUrl) {
            res.status(404).send()
        } else {
            res.redirect(screenUrl)
        }
    } catch(err) {
        logger.error(err.message)
        res.status(400).send(err)
    }
})

app.get('*', (req, res) => {
    res.status(404).send()
})
