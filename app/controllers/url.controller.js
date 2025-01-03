const { where } = require('sequelize');
const { url, user, analytics } = require('../models');
const logger = require('./logger');
exports.createshortUrl = async (req, reply) => {
    try {
        const { originalurl, userid } = req.body;

        if (!originalurl) {
            return reply.status(400).send({ status: false, message: "Original URL is required" });
        }
        if (!userid) {
            return reply.status(400).send({ status: false, message: "User ID is required" });
        }
        const checkuser = await user.findOne({ where: { id: userid } })
        if (!checkuser) return reply.status(404).send({ status: false, message: `User not present for this id  ${userid}` });
        const checkurl = await url.findOne({ where: { originalurl: originalurl, userid: userid } });
        if (checkurl) {
            return reply.status(200).send({
                status: true,
                message: `The URL "${originalurl}" has already been shortened.`,
            });
        }
        const { nanoid } = await import('nanoid');

        const shortId = nanoid(11);

        const shortUrl = `http://localhost:8080/redirect/${shortId}`;

        await url.create({
            originalurl: originalurl,
            shorturl: shortUrl,
            userid: userid,
            shortid: shortId
        });

        return reply.status(200).send({
            status: true,
            message: "URL shortened successfully",
            shortUrl: shortUrl,
        });

    } catch (err) {
        logger.error({
            functionName: 'createshortUrl',
            method: req.method,
            body: req.body,
            params: req.params,
            errorMessage: err.message,
        }, "Error occurred in createshortUrl function");

        return reply.status(500).send({ status: false, message: err.message });
    }
};


exports.getOriginalurl = async (req, reply) => {
    try {
        const { shortid } = req.params;
        const urlData = await url.findOne({ where: { shortid: shortid } });

        if (!urlData) {
            return reply.status(404).send({
                status: false,
                message: "original URL not found ",
            });
        }
        return reply.status(200).send({
            status: true,
            message: "original url get successfully",
            originalurl: urlData.originalurl,
        });
    } catch (err) {
        logger.error(
            {
                functionName: 'getOriginalurl',
                method: req.method,
                params: req.params,
                errorMessage: err.message,
            },
            "Error occurred in getOriginalurl function"
        );

        return reply.status(500).send({ status: false, message: err.message });
    }
};
exports.redirectToOriginalUrl = async (req, reply) => {
    try {
        const { shortid } = req.params;
        const urlData = await url.findOne({ where: { shortid: shortid } });

        if (!urlData) {
            return reply.status(404).send({
                status: false,
                message: "Short URL not found ",
            });
        }
        return reply.redirect(urlData.originalurl);

    } catch (err) {
        logger.error(
            {
                functionName: 'redirectToOriginalUrl',
                method: req.method,
                params: req.params,
                errorMessage: err.message,
            },
            "Error occurred in redirectToOriginalUrl function"
        );

        return reply.status(500).send({ status: false, message: err.message });
    }
};
exports.getListofurl = async (req, reply) => {
    try {
        const { userid } = req.params;
        const urllist = await url.findAll({ where: { userid: userid } });

        if (urllist.length == 0) {
            return reply.status(200).send({ status: true, message: `no records for this userid  ${userid}` });

        }

        return reply.status(200).send({
            status: true,
            message: "url list fetch successfully",
            data: urllist,
        });
    } catch (err) {
        logger.error(
            {
                functionName: 'getListofurl',
                method: req.method,
                params: req.params,
                errorMessage: err.message,
            },
            "Error occurred in getListofurl function"
        );

        return reply.status(500).send({ status: false, message: err.message });
    }
};



exports.analyticscountsandtimestamps = async (req, reply) => {
    try {
        const { shortUrlId } = req.body;
        const urldata = await url.findOne({ where: { id: shortUrlId } });

        if (!urldata) {
            return reply.status(200).send({ status: true, message: `No records found` });
        }

        let userIp = req.ip;
        if (req.headers['x-forwarded-for']) {
            userIp = req.headers['x-forwarded-for'].split(',')[0];
        }

        const analyticsRecord = await analytics.findOne({ where: { shortUrlId } });

        if (analyticsRecord) {
            await analyticsRecord.update({
                clickCount: analyticsRecord.clickCount + 1,
                userIp: [...analyticsRecord.userIp, userIp],
                timestamp: [...analyticsRecord.timestamp, new Date()]
            });

            return reply.status(200).send({
                status: true,
                message: `Analytics updated successfully`,
                data: analyticsRecord
            });
        } else {
            const analyticsdata = await analytics.create({
                shortUrlId,
                clickCount: 1,
                userIp: [userIp],
                timestamp: [new Date()]
            });

            return reply.status(201).send({
                status: true,
                message: `Analytics record created successfully`,
                data: analyticsdata
            });
        }
    } catch (err) {
        logger.error(
            {
                functionName: 'analyticscountsandtimestamps',
                method: req.method,
                params: req.params,
                errorMessage: err.message,
            },
            "Error occurred in analyticscountsandtimestamps function"
        );

        return reply.status(500).send({ status: false, message: err.message });
    }
};

exports.getanalytics = async (req, reply) => {
    try {
        const { shortUrlId } = req.params;

        const analyticsdata = await analytics.findOne({ where: { shortUrlId } });
        return reply.status(200).send({
            status: true,
            message: "analyticsdata fetch successfully",
            data: analyticsdata,
        });
    } catch (err) {
        logger.error(
            {
                functionName: 'getanalytics',
                method: req.method,
                params: req.params,
                errorMessage: err.message,
            },
            "Error occurred in getanalytics function"
        );

        return reply.status(500).send({ status: false, message: err.message });
    }
};




