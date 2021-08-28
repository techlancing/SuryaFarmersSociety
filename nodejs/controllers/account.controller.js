const oExpress = require('express');
const oMongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const oUserModel = require("../data_base/models/user.model");
// const oRetailerModel = require("../data_base/models/retailer.model");
// const oAddressModel = require("../data_base/models/address.model");
const oAuthentication = require("../middleware/authentication");

const oAccountRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

/*oAccountRouter.post("/users", asyncMiddleware(async (oReq, oRes, oNext) => {
  const user = new oUserModel(oReq.body);

  try{
      await user.save();
      const token = await user.generateAuthToken()

      oRes.json({'user' : user,
                'token' :token});
  
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));*/

// url: ..../account/login
oAccountRouter.post("/login", asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let user = null;
    let bIsRetailer = false;

    user = await oUserModel.findUserByCredentials(oReq.body.sEmail, oReq.body.sPassword);
    console.log(oReq.body.sEmail);
    console.log(oReq.body.sPassword);
    console.log(user);
    if (user === 0) {
      oRes.status(401).send({ error: 'Email does not exists. Please create a free account' });
    } else if (user === 1) {
      oRes.status(401).send({ error: 'Invalid Email or Password' });
    }else{
      const token = await user.generateAuthToken();
      oRes.json({
        'sUserEmail': user.sUserEmail,
        'sUserName': user.sUserName,
        'bIsRetailer': false,
        '_token': token,
        '_expirytokentime': user.sTokenExpiryTime
      });
    }
    

  } catch (oError) {
    console.log(oError);
    oRes.status(400).send();
  }
}));


// url: ..../account/logout
oAccountRouter.post("/logout", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    oReq.user.tokens = oReq.user.tokens.filter((token) => {
      return token.token !== oReq.token
    })
    await oReq.user.save()

    oRes.json('Success')
  } catch (oError) {
    console.log(oError);
    oRes.status(500).send();
  }
}));


// url: ..../account/logoutAll     (logout from all sessions)
oAccountRouter.post("/logoutAll", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    oReq.user.tokens = []
    await oReq.user.save()
    oRes.json('Success')
  } catch (oError) {
    console.log(oError);
    oRes.status(500).send();
  }
}));

oAccountRouter.get("/me", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  oRes.json(oReq.user);
}));

// url: ..../account/createuseraccount
oAccountRouter.post("/createuseraccount", asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const user = await oUserModel.addUserByCredentials(oReq.body.sName, oReq.body.sEmail, oReq.body.sPassword, oReq.body.nMobile);

    if (user) {
      //const token = jwt.sign({_id:oReq.body.sEmail},'thisisuserAutentication');
      oRes.json(oReq.body.sEmail);
    }
    else {
      oRes.status(200).json({ error: 'Email is already registerd' })
    }
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));


// Update account
oAccountRouter.patch("/me", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  const updates = Object.keys(oReq.body)
  const allowedUpdates = ['name', 'email', 'password']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return oRes.status(400).send({ 'error': 'Invalid Updates!' })
  }

  try {

    updates.forEach((update) => oReq.user[update] = oReq.body[update])
    await oReq.user.save();

    oRes.json(oReq.user)

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// Delete account
oAccountRouter.delete("/me", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {

  try {
    await oReq.user.remove()
    oRes.json(oReq.user)

  } catch (oError) {
    console.log(oError);
    oRes.status(500).send();

  }
}));

//url: ..../account/getusers
oAccountRouter.get("/getusers", asyncMiddleware(async (oReq, oRes, oNext) => {

  try {
    const oUsers = await oUserModel.find({});
    let users = [];
    let oAddress = null;
    await Promise.all(oUsers.map(async (user) => {

      oAddress = await oAddressModel.findOne({ nUserId: user.nUserId });
      //console.log(oAddress);

      users.push({
        'sUserEmail': user.sUserEmail,
        'sUserName': user.sUserName,
        'sUserMobile': user.sUserMobile,
        'sUserAddress': oAddress,
        'sUserJoiningDate': user.createdAt
      });
    }));
    oRes.json({ 'users': users });

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

module.exports = oAccountRouter;