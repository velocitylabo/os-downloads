# os-downloads [![Build Status](https://travis-ci.org/piroz/os-downloads.svg?branch=master)](https://travis-ci.org/piroz/os-downloads)
Look up downloads directory specific to different operating systems.

# Supported platform

- win32
- darwin
- linux

# Install

```console
$ npm install --save os-downloads
```

# Usage

```javascript
const downloads = require("os-downloads");

downloads();
//=> 'C:\Users\Test\Downloads'
```