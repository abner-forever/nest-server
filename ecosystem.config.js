module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/main.js',
      watch: 'dist/main.js',
      error_file: './logs/error.log', //错误输出日志
      out_file: './logs/info.log', //日志
      log_date_format: 'YYYY/MM/DD HH:mm:ss', //日期格式
      instances: 1,
      exec_mode: 'fork',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
