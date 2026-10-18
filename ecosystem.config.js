module.exports = {
    apps: [
        {
            name: "app-frontend",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3001 -H 127.0.0.1",
            cwd: "/root/app-deployment/frontend",
            instances: 1,
            exec_mode: "fork",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
}