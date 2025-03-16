# Shopitype

![Build Status](https://github.com/zayez/shopitype/workflows/Test/badge.svg)

## Requirements

- Nix [installed](https://nixos.org/download.html)

## Setting up tools

To setup the development environment, type:

```bash
nix-shell shell.nix
```

## Development

### Installing the **server** dependencies

```bash
cd server
npm install
```

### Creating the database

Inside the _server_ directory, type:

```bash
npm run create:db:dev
```

### Installing the **client** depedencies

```bash
cd ../client
npm install
```

Now you're ready to start development, run the following command inside the _client_ directory:

```bash
npm run start:dev
```

## License

[MIT](LICENSE).
