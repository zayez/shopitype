# Shopitype server API

![Build Status](https://github.com/zayez/shopitype/workflows/Test/badge.svg)

## Installing

Install the project's dependencies:

```bash
npm install
```

### Creating .env file

Create a **.env** file using the base template:

```bash
cp .env-template.env .env
```

Then, edit the **.env** file with the appropriated values.

**IMPORTANT:** It's absolutely necessary to provide a value to the field _JWT_SECRET_. Please, don't leave it empty.

## Running the server

To start the server, just type:

```bash
npm run start:dev
```

## Credits

- [queryBuilder from crud-server (MIT)](https://github.com/robmclarty/cred-server)
