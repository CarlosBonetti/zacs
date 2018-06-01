import request from 'request-promise-native'

import config from './config'

const requestLogin = async () => {
    const body = await request.post('https://api.zeplin.io/users/login', {
        form: {
            handle: config.ZEPLIN_USERNAME,
            password: config.ZEPLIN_PASSWORD,
        }
    })

    const auth = JSON.parse(body)
    if (!auth || !auth.token) {
        throw new Error('Error retrieving auth token')
    }
    return auth
}

const requestApiData = async (authToken, projectId) => {
    const body = await request.get(`https://app.zeplin.io/project/${projectId}`, {
        headers: {
            'Cookie': request.cookie(`userToken=${authToken}`)
        }
    })

    const regex = /window\.Zeplin\[\"apiData\"\] = (.*)<\/script>/g
    const res = regex.exec(body)

    if (!res || !res[1]) {
        throw new Error(`API data for project '${projectId}' not found or impossible to retrieve`)
    }

    return eval(res[1]) // TODO: DANGER
}

export const getApiData = async (projectId) => {
    const auth = await requestLogin()
    return await requestApiData(auth.token, projectId)
}
