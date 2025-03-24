<!--
 @changed 2025.03.25, 02:23
-->

# About

Compile EJS templates to HTML with Webpack

- Published build: https://imodelist.lilliputten.ru/
- Forked repository: https://github.com/lilliputten/imodelist
- Web site address: https://i-modelist.ru/
- Original repository: https://github.com/uknowmyname89/imodelist

## Install

Due to compatibilituy issues use only npm  package manager (not pnpm or other) and node v. 16 (or older?). With nvm see `.nvmrc` configuration file, use `nvm list` and `nvm use 16` commands.

```bash
git clone git@github.com:lilliputten/imodelist.git
cd imodelist
npm install
```

## Build

```bash
npm run dev
npm run build
```

To publish built demo (you'll have to set up th `publich` branch submodule first; use `sh .utils/publish-init.sh` script):

```bash
sh .utils/publish.sh
```
