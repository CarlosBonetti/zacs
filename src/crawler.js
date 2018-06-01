import request from 'request-promise-native'

import config from './config'

const requestLogin = async () => {
    return await request.post('https://api.zeplin.io/users/login', {
        form: {
            handle: config.ZEPLIN_USERNAME,
            password: config.ZEPLIN_PASSWORD,
        }
    })
}

const requestApiData = async (authToken, projectId) => {
    const body = await request.get(`https://app.zeplin.io/project/${projectId}`, {
        headers: {
            'Cookie': request.cookie(`userToken=${authToken}`)
        }
    })

    const regex = /window\.Zeplin\[\"apiData\"\] = (.*)<\/script>/g
    const res = regex.exec(body)

    return eval(res[1]) // TODO: DANGER
}

export const getApiData = async (projectId) => {
    const auth = JSON.parse(await requestLogin())
    if (!auth.token) {
        throw new Error('Auth token not found')
    }

    const apiData = await requestApiData(auth.token, projectId)
    return apiData
}
