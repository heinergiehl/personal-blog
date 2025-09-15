module.exports = {
    apps: [
        {
            name: 'blog',
            cwd: '/var/www/latest-portfolio',
            script: 'bun',
            args: 'run start',
            env_production: {
                NODE_ENV: 'production',
                PORT: process.env.APP_PORT || 3002,
                // any other envs your app needs…
            }
        }
    ]
}
