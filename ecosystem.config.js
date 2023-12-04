const { name } = require('./package.json');

module.exports = {
  apps: [
    {
      name,
      script: 'npm run start',
      autorestart: true,
    },
  ],
};
