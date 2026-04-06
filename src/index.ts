import "dotenv/config"
import logger from "./logger.js"
import app from "./controller/app.js"
import accountingService from "./service/AccountingServiceImpl.js"
const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`server is listening on port ${port}`))
function shutdown() {
    logger.debug("shutdown has called")
    server.close(async() => {
        await accountingService.save()
        logger.info("server closed; data saved if updated")
    })
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);