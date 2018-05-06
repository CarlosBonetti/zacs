import express from 'express'

import { Project, Screen } from './db'
import { getScreen } from './crawler'

const app = express()

app.get('/:projectId/:screenId.png', async (req, res) => {
    const { projectId, screenId } = req.params

    let project
    try {
        project = await Project.findOne({ pid: projectId })
    } catch(err) {
        console.error(err)
    }

    if (project === null) {
        try {
            project = new Project({ pid: projectId })
            await project.save()
        } catch (err) {
            console.error(err)
            res.send(err)
        }
    }

    let screen = await Screen.findOne({ sid: screenId })
    if (screen == null) {
        console.log(`Screen ${screenId} not found on local database. Scraping it...`)
        const image = await getScreen(projectId, screenId)
        console.log(`Screen ${screenId} found at ${image}!`)
        screen = new Screen({ sid: screenId, image, project })
        await screen.save()        
    }

    res.redirect(screen.image)
})

if (!process.env.ZEPLIN_USERNAME || !process.env.ZEPLIN_PASSWORD) {
    throw new Error('You must define ZEPLIN_USERNAME and ZEPLIN_PASSWORD')
    exit(1)
} 

app.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line
    console.log('Listening on port 3000')
})
