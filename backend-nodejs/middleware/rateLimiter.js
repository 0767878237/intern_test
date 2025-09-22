const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,                
  message: "Too many requests from this IP, please try again after 5 minutes."
});

module.exports = limiter;