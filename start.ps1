cd $PSScriptRoot;
git pull origin master;
npm run build;
docker-compose build;
docker-compose up -d;