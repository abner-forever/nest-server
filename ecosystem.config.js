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
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      restart_delay: 60,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
