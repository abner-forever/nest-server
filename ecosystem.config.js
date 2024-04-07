module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/main.js',
      watch: ['dist'],
      error_file: './logs/error.log',
      out_file: './logs/info.log',
      log_date_format: 'YYYY/MM/DD HH:mm:ss',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      restart_delay: 5000,
    },
  ],
};
