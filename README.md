# Tracollab

## Setup project

Run the following command to install all packages after cloning the repo:

``` npm install ```

Add a .env file in the tracollab project folder containing the following:

```
DATABASE_URL="mongodb://localhost:27017/localdb?replicaSet=rs0" # This is the database URL used if you are setting up the database locally with our docker-compose file
SECRET_KEY="<your secret JWT key>"                              # Key used to sign the JWT for authentication
GC_KEY="<path to your google cloud service account key>"   # https://cloud.google.com/iam/docs/keys-create-delete?hl=fr for more information
```

## Setup local database

In the root folder (where the docker-compose.yaml file is located) run the following command:

``` docker-compose up -d ```

In the tracollab project folder, run the following commands:

```
npx prisma generate
npx prisma db push
```

Your database is now setup!

