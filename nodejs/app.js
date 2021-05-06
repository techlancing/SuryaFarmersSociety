var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser');

let sRootPath = process.env.ROOT_PATH;

const oPort = process.env.PORT ||2155;

var oServer = express();

const oDBConnection = require('./data_base/connection');

// API endpoit controllers
// const oProductController = require("./controllers/product.controller");
// const oCategoryController = require("./controllers/category.controller");
// const oSubCategoryController = require("./controllers/subcategory.controller");
// const oConfigurationtypeController = require("./controllers/configurationtype.controller");
// const oConfigurationvalueController = require("./controllers/configurationvalue.controller");
const oCarController = require("./controllers/car.controller");
// const oManufacturerController = require("./controllers/manufacturer.controller");
// const oAddressController = require("./controllers/address.controller");
// const oCartController = require("./controllers/cart.controller");
// const oBannerController = require("./controllers/banner.controller");
const oAccountController = require("./controllers/account.controller");
// const oVendorController = require("./controllers/vendor.controller");
// const oProductListFiltersController = require("./controllers/productlist_filters.controller");
// const oRazorPayController = require("./controllers/razorpay.controller");


// catch 404 and forward to error handler
// oServer.use(function(req, res, next) {
//   next(createError(404));
// });


var whitelist = [process.env.ORIGIN_USER, process.env.ORIGIN_ADMIN]
oServer.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin)
      callback(null, true);
    else
      callback(new Error('Not allowed by CORS'));
  }
}));

oServer.use(logger('dev'));
oServer.use(express.json());
// oServer.use(express.urlencoded({ extended: false }));
oServer.use(bodyparser.urlencoded({ extended: true }));
oServer.use(bodyparser.json());
oServer.use(bodyparser.raw());
oServer.use(cookieParser());
oServer.use(express.static(path.join(__dirname, 'public')));
//oServer.use(cors());




// error handler
oServer.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

// Configure the routes
// oServer.use(sRootPath + "/product", oProductController);
// oServer.use(sRootPath + "/category", oCategoryController);
// oServer.use(sRootPath + "/subcategory", oSubCategoryController);
// oServer.use(sRootPath + "/configurationtype", oConfigurationtypeController);
// oServer.use(sRootPath + "/configurationvalue", oConfigurationvalueController);
oServer.use("/nodejs/car", oCarController);
// oServer.use(sRootPath + "/manufacturer", oManufacturerController);
// oServer.use(sRootPath + "/address", oAddressController);
// oServer.use(sRootPath + "/cart", oCartController);
// oServer.use(sRootPath + "/banner", oBannerController);
oServer.use("/nodejs/account", oAccountController);
// oServer.use(sRootPath + "/vendor", oVendorController);
// oServer.use(sRootPath + "/razorpay", oRazorPayController);
// oServer.use(sRootPath + "/productlistfilters", oProductListFiltersController);


oServer.get("/", (req, res) => {

  console.log("Node js url is working");
  res.send('<h1>Welcome to our Node js application</h1>');
});

oServer.listen(oPort, () => {
  console.log('Server started at: ' + oPort);
})
