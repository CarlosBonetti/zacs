import mongoose, { Schema } from 'mongoose'

mongoose.connect('mongodb://0.0.0.0/zeplin-crawler')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Connected to mongodb')
})

export default db

const screenSchema = new Schema({
    sid: String,
    image: String,
})

const projectSchema = new Schema({
    pid: {
        type: String,
        required: true,
    },
    screens: [screenSchema],
})

export const Project = mongoose.model('Project', projectSchema)
export const Screen = mongoose.model('Screen', screenSchema)
