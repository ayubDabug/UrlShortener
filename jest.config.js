// jest.config.js
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, 'env.jest');
require('dotenv').config({ path: envFile });

const testsDir = path.join(__dirname, 'tests');

if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}


module.exports = {
  verbose: true,
  testTimeout: 5000,
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
