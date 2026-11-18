Faracard project by Erfan Ghasemian Amiri and Ali gholamzade

in order to start the project:

```bash
npm i
npm run dev
```

open your browser and copy paste this url below to see the result:
http://localhost:3000/

latest developments on the develop branch — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Docker

```bash
docker build -t bandup-frontend .
docker run -p 8080:80 bandup-frontend
```

Static export (`output: "export"` in next.config.ts), served by nginx — no Node runtime
needed in the container.
