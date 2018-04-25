import express from 'express'

import { Project } from './db'

const app = express()

app.get('/:projectId/:screenId', async (req, res) => {
    const { projectId, screenId } = req.params

    let project
    try {
        project = await Project.findOne({ pid: projectId })
    } catch(err) {
        console.error(err)
    }

    if (project === null) {
        project = new Project({ pid: projectId })
        try {
            await project.save()
        } catch (err) {
            console.error(err)
            res.send(err)
        }
        console.log(project)
    }

    res.send(projectId + '/' +  screenId)
})

app.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line
    console.log('Listening on port 3000')
})
