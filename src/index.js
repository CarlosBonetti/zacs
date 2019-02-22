import config from "./config"
import app from "./app"
import logger from "./logger"

app.listen(config.SERVER_PORT, () => {
    logger.info(`Listening on port ${config.SERVER_PORT}`)
})
