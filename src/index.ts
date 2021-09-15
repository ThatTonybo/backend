import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

import { connect } from './util/database'
import router from './util/router'

config()

const server = express()
    .use(cors({
        origin: process.env.FRONTEND_URL || 'https://revolt.social',
        credentials: false
    }))
    .use(express.json())

connect()
router(server)

server.listen(process.env.PORT, () =>
    console.info(`Listening on port ${process.env.PORT}`)
)