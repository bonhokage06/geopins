module.exports = {
  apps : [
      {
        name: "geopins web",
        script: "npx",
	interpreter:"none",
	args:"serve build -s -p 8000",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 8000,
            "NODE_ENV": "production",
        }
      }
  ]
}
