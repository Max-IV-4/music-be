import 'dotenv/config'
import logger from './logger.js'

const PORT = process.env.PORT || 3000

import express from 'express'
const app = express()

const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`)
})

process.on('SIGINT', () => {
    server.close()
    logger.info('Server stopped')
    process.exit(0)
})

process.on('SIGTERM', () => {
    server.close()
    logger.info('Server stopped')
    process.exit(0)
})