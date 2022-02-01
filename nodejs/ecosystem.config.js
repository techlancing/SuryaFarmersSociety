module.exports = {
  apps: [{
    script: 'app.js',
    name: 'suryafarmers',
    watch: true,
    ignore_watch: ["node_modules", "logs", "uploads", "public"],
    //error_file : "./logs/err.log",
    //out_file : "./logs/output.log",
    log_file: './logs/combinedLog.log',
    time: true,
    env: {
      "PORT":2155,
      "IS_PRODUCTION": "NO",
      "IS_STAGING": "NO",
      "ROOT_PATH": "/nodejs",
      "UPLOAD_PATH" : "public/uploads",
      "LOCALHOST_DB_PATH": 'mongodb://localhost:27017/suryafarmers',
      "VPS_DB_PATH": 'mongodb://adaptnext:AdaptNext%232020@localhost:27017/suryafarmers?authSource=admin',
      "UPLOAD_PATH": "public/uploads",
      "ORIGIN_USER": "http://localhost:6200",
      "ORIGIN_ADMIN": "http://localhost:6200",
      "RPAY_KEY": "rzp_test_DiS8pCIWhCd9rI",
      "RPAY_SECRET": "s9tVPFwMjhgzpIsmZZOIqUYE",
      "TXTLCL_KEY": "7fdda8fe55f910e254cd303dcb5c9a7a4fa76c52d30944c5ed31db5b38d2f6ae"
    }
  }]
};
