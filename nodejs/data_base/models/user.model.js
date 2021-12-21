const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);
const oValidator = require('validator');
const jwt = require('jsonwebtoken');
const oBcrypt = require('bcryptjs');

const oSchema = oMongoose.Schema

var oUserSchema = new oSchema( { 
  nUserId : {type: Number},//unique: true},
  sUserName : {
    type: String,
    //unique: true,
    required: true,
    lowercase: true,
    trim:true
  },
  sUserEmail : {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim:true,
    validate(value){
      if(!oValidator.isEmail(value)){
        throw new Error('Email is invalid');
      }
    }
  },
  sUserMobile : {
    type: String,
    trim: true,
    validate(value){
      if(!oValidator.isMobilePhone(value)){
        throw new Error('Mobile Number is invalid');
      }
    }
    
  },
  sUserPassword : {
    type: String,
   /* validate(value){
      if(!oValidator.isStrongPassword(value)){
        throw new Error('Password is invalid');
     }
    }*/
  },
  sRole : {
    type: String,
    //unique: true,
    required: true,
    lowercase: true,
    trim:true
  },
  sTokenExpiryTime: {
    type: Number
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
}]
},{
  timestamps : true
});
oUserSchema.plugin(oAutoIncrement, {inc_field: 'nUserId',start_seq:800000});

//Hash the plain text password before saving
oUserSchema.pre('save', async function (next) {
  const user = this
  
  if(user.isModified('sUserPassword')){
    user.sUserPassword = await oBcrypt.hash(user.sUserPassword,8)
  }
  
  next()
});

oUserSchema.methods.toJSON = async function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject

}

// To generate tokens for login and other user operations
oUserSchema.methods.generateAuthToken = async function () {
  const user = this
  console.log(user._id.toString())
  const token = jwt.sign({ _id: user._id.toString() }, 'thisisuserAutentication',{expiresIn: '60d'})
  //calculate expiry token
  let dateObj = Date.now();
  dateObj += 1000 * 60 * 60 * 24 * 60;
  dateObj = new Date(dateObj);
  user.sTokenExpiryTime = dateObj;
  user.tokens = user.tokens.concat({ token })

  if(user.tokens.length > 5)
  {
    (user.tokens).splice(0,user.tokens.length - 5);
  }
  await user.save()

  return token
}

//Adding credentials to create account / To check whether the user existing already
oUserSchema.statics.addUserByCredentials = async(name,email,password,mobile)=> {
  let user = await User.findOne({sUserEmail : email});
  if(!user){
    user = new User();
    user.sUserName = name;
    user.sUserEmail = email;
    user.sUserPassword = password;
    user.sUserMobile = mobile;
    await user.save();
    return user;
  }else{
    //throw new Error('Email is already registered');
    return null;
  }
};

// Checking the Credentials to login
oUserSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ sUserEmail: email })

  if (!user) {
      return 0;
  }

  const isMatch = await oBcrypt.compare(password,user.sUserPassword);
  
  if (!isMatch) {
    return 1;
  }

  return user
}

const User = oMongoose.model("User", oUserSchema);
module.exports = User;