const bcrypt = require('bcryptjs');
const { user } = require('../models');
const logger = require('./logger');
const { generateToken } = require("../middleware/authenticate")
exports.register = async (req, reply) => {
    try {
        const { name, email, password } = req.body;
        if (!name) return reply.status(400).send({ status: false, message: "name is mandatory" });
        if (!email) return reply.status(400).send({ status: false, message: "email is mandatory" });
        if (!password) return reply.status(400).send({ status: false, message: "password is mandatory" });

        const checkemail = await user.findOne({ where: { email: email } });
        if (checkemail) {
            return reply.status(404).send({ status: false, message: "user already exists" });
        }
        const genSalt = 10;
        const hashPassword = await bcrypt.hash(password, genSalt);
        const userData = {
            name,
            email,
            password: hashPassword,
        };
        const data = await user.create(userData);
        return reply.status(201).send({ status: true, message: "user registered successfully", data: data });
    } catch (err) {
        logger.error({
            functionName: 'register',
            method: req.method,
            body: req.body,
            params: req.params,
            errorMessage: err.message,
        }, "Error occurred in register function");

        return reply.status(500).send({ status: false, message: err.message });
    }
};
exports.login = async (req, reply) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return reply.status(400).send({ status: false, message: "email is mandatory" });
        }
        if (!password) {
            return reply.status(400).send({ status: false, message: "password is mandatory" });
        }
        const userdata = await user.findOne({ where: { email } });
        if (!userdata) {
            return reply.status(401).send({ status: false, message: "user not present for this email" });
        }
        const checkpassword = await bcrypt.compare(password, userdata.password);
        if (!checkpassword) {
            return reply.status(401).send({ status: false, message: "password is incorrect" });
        }
        const token = await generateToken(email, userdata.id);
        return reply.status(200).send({
            status: true,
            message: "user login successfully",
            data: userdata,
            token,
        });
    } catch (err) {
        logger.error({
            functionName: 'login',
            method: req.method,
            body: req.body,
            params: req.params,
            errorMessage: err.message,
        }, "Error occurred in login function");
        return reply.status(500).send({ status: false, message: err.message });
    }
}




