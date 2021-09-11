const jwt = require('jsonwebtoken');
const oUserModel = require("../data_base/models/user.model");
// const oRetailerModel = require("../data_base/models/retailer.model");


const authentication = async (oReq, oRes, next) => {
    try {
        const token = oReq.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisuserAutentication')
        let user = null;
        let retailer = null;
        let bIsRetailer = false;
        user = await oUserModel.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
                throw new Error()
        }

        oReq.token = token
        oReq.user = user
        oReq.bIsRetailer = bIsRetailer
        next()

    } catch (oError) {
        oRes.status(401).send({ error: ' Please Authenticate. ' })
    }
}

module.exports = authentication