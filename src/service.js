import { Project, Screen } from './db'
import { getApiData } from './crawler'
import logger from './logger'

export const getScreen = async (projectId, screenId) => {
    const apiData = await getApiData(projectId)

    console.log(apiData)

    console.log(apiData.project.screens)

    for (const s of apiData.project.screens) {
        console.log(s.latestVersion.snapshot.url)
    }

    return apiData.project.screens
        .find(screen => screen._id === screenId)
        .latestVersion.snapshot.url
}

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
