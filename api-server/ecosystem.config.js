module.exports = {
  apps: [
    {
      name: 'khh-happinometer-api',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 4001,
      },
    },
  ],
}
