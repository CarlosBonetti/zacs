import { Project, Screen } from './db'
import { getScreen } from './crawler'
import logger from './logger'

export const getScreenUrl = async (projectId, screenId) => {
    let project = await Project.findOne({ pid: projectId })

    if (project === null) {
        project = new Project({ pid: projectId })
        await project.save()
    }

    let screen = await Screen.findOne({ sid: screenId })
    if (screen == null) {
        logger.debug(`Screen ${screenId} not found on local database. Scraping it...`)
        const image = await getScreen(projectId, screenId)
        logger.debug(`Screen ${screenId} found at ${image}!`)
        screen = new Screen({ sid: screenId, image, project })
        await screen.save()
    }

    return screen.image
}
