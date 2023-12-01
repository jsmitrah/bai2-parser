# BAI2 Parser

BAI2 Parser for parsing the bai files to convert into the CSV or JSON file.
Check out our documentation below to learn how to get started.


## Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Methods](#-methods)

## 🚀 Installation

1. Install `bai2-parser`:

```bash
yarn add bai2-parser
```

```bash
npm install bai2-parser
```

## 🎉 Usage

Here is a basic example of how to use bai2 parser. It covers all the main features.


```js
import fs from 'fs'
import { BAI2 } from 'bai2-parser'

// you need to convert the bai file to string file when use the fromString() prop.

const fileString = fs.readFileSync(`./sample.bai`).toString()

// You can get the parsed answer from file string using below prop.

const parsefromString = BAI2.fromString(fileString, { output:'JSON' })

console.log('parsefromString', parsefromString)


// You can get the parsed answer from file using below prop.

const parsefromFile = BAI2.fromFile(`../input/sample.bai`, { output:'CSV' })

console.log('parsefromFile', parsefromFile)

```


# 📖 Methods

#### `BAI2.fromString(fileString, options)` => `string`

Returns the JSON or CSV `string` or rejects with an `Error` if there was an issue.

* `fileString` - An fileString of BAI2 file to be converted to JSON or CSV.
* `options`    - (Optional) A BAI2 file specifying any of the following key value pairs:

#### `BAI2.fromFile(filePath, options)` => `string`

Returns the JSON or CSV `string` or rejects with an `Error` if there was an issue.

* `filePath`   - An filePath of BAI2 file to be converted to JSON or CSV.
* `options`    - (Optional) A BAI2 file specifying any of the following key value pairs:


# 📄 License

MIT
