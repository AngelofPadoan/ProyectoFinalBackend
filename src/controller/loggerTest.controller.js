class LoggerTestController {
    static loggerTest = (req, res) => {
        req.logger.fatal("Testing fatal logger");
        req.logger.error("Testing error logger");
        req.logger.warning("Testing warning logger");
        req.logger.info("Testing info logger");
        req.logger.http("Testing http logger");
        req.logger.debug("Testing debug logger");

        res.send({
            status: "success",
            message: "Todas los loggers probados"
        })
    }
}

export { LoggerTestController }