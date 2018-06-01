import { getApiData } from './crawler'
import logger from './logger'

const cache = {}

export const getScreenUrl = async (projectId, screenId) => {
    let apiData = cache[projectId]

    if (!apiData) {
        logger.info(`Retrieving API data for project ${projectId}`)

        try {
            apiData = await getApiData(projectId)
            cache[projectId] = apiData
        } catch(err) {
            logger.error(err.message)
            return null
        }
    }

    const screen = apiData.project.screens.find(screen => screen._id === screenId)

    if (!screen) {
        return null
    }

    return screen.latestVersion.snapshot.url
}
