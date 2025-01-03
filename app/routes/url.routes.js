
const urlcontroller = require("../controllers/url.controller");
const { authenticateToken } = require("../middleware/authenticate");

module.exports = (fastify) => {
    fastify.post(
        "/api/url/createshorturl",
        { preHandler: [authenticateToken] },
        urlcontroller.createshortUrl
    );

    fastify.get(
        "/api/url/getoriginalurl/:shortid",
        { preHandler: [authenticateToken] },
        urlcontroller.getOriginalurl
    );

    fastify.get(
        "/redirect/:shortid",
        urlcontroller.redirectToOriginalUrl
    );

    fastify.get(
        "/api/url/urllist/:userid",
        { preHandler: [authenticateToken] },
        urlcontroller.getListofurl
    );

    fastify.post(
        "/api/storeanalytics",
        { preHandler: [authenticateToken] },
        urlcontroller.analyticscountsandtimestamps
    );

    fastify.get(
        "/api/getanalyticsdata/:shortUrlId",
        { preHandler: [authenticateToken] },
        urlcontroller.getanalytics
    );



};
