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
      "ROOT_PATH": "/nodejs",
      "UPLOAD_PATH" : "public/uploads",
      "CLUSTER_DB_PATH": "mongodb+srv://raghuram:adaptnext@cluster0.vpew3.mongodb.net/suryafarmers?retryWrites=true&w=majority",
      "LOCALHOST_DB_PATH": 'mongodb://localhost:27017/suryafarmers',
      "VPS_DB_PATH": 'mongodb://adaptnext:AdaptNext%232020@localhost:27017/suryafarmers?authSource=admin',
      "UPLOAD_PATH": "public/uploads",
      "ORIGIN_USER": "http://localhost:6000",
      "ORIGIN_ADMIN": "http://localhost:6000",
      "RPAY_KEY": "rzp_test_DiS8pCIWhCd9rI",
      "RPAY_SECRET": "s9tVPFwMjhgzpIsmZZOIqUYE"
    }
  }]
};
