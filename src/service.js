import schedule from "node-schedule"

import { getApiData } from "./crawler"
import logger from "./logger"

let cache = {}

const clearCacheJob = schedule.scheduleJob("0 0 * * * *", () => {
    cache = {}
    logger.debug("Cache cleaned")
})

export const getProjectData = async projectId => {
    let projectData = cache[projectId]

    if (!projectData) {
        logger.info(`Retrieving API data for project ${projectId}`)
        projectData = await getApiData(projectId)
        cache[projectId] = projectData
    }

    return projectData
}

export const getScreenUrl = async (projectId, screenId) => {
    let projectData = await getProjectData(projectId)

    if (!projectData) {
        return null
    }

    const screen = projectData.project.screens.find(
        screen => screen._id === screenId
    )

    if (!screen) {
        return null
    }

    return screen.latestVersion.snapshot.url
}
