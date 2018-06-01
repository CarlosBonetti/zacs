/* eslint-disable no-console */

import mongoose, { Schema } from 'mongoose'
import logger from './logger'

mongoose.connect('mongodb://0.0.0.0/zeplin-crawler')

const db = mongoose.connection

db.on('error', logger.error)

db.once('open', () => {
    logger.debug('Connected to mongodb')
})

export default db

const projectSchema = new Schema({
    pid: {
        type: String,
        required: true,
    },
})

const screenSchema = new Schema({
    sid: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    project: projectSchema,
})

export const Project = mongoose.model('Project', projectSchema)
export const Screen = mongoose.model('Screen', screenSchema)
