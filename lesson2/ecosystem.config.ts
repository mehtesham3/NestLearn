module.exports = {
  apps: [
    {
      name: 'nest-api',
      script: 'dist/main.js',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster', // Load balancing
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};

// npm run build
// pm2 start ecosystem.config.js --env production
// pm2 save
// pm2 startup  # Auto-start on server reboot
