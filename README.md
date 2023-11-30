# BAI2 Parser

BAI2 Parser for parsing the bai files to convert into the CSV or JSON file.
Check out our documentation below to learn how to get started.

## Example Image

<!-- ![example](./arc-progressbar.gif) -->

## Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Props](#-props)

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

// you need to convert the bai file to string file.

const fileString = fs.readFileSync(`./sample.bai`).toString()

const parser = BAI2.Reader.File.read(fileString)

console.log("parser", parser)  // you will get the answer

```


# 📖 Props

| Name                        | Type                                                                              | Default          | Description                                                                                                                                                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fillValue                   | number (0-100)                                                                    | 0                | Current progress value                                                                                                                                                                                                                                            |
| segments                    | Array of { scale: number, filledColor: string, emptyColor: string, data: object } | []               | Segments of the arc. Here, scale is a percentage value out of 100%, filledColor for filled part of a segment, and emptyColor is background color for an empty segment, data could be any object that you'd want to receive back for a segment. See example above. |
| filledArcWidth              | number                                                                            | 8                | Thickness of progress line                                                                                                                                                                                                                                        |
| emptyArcWidth               | number                                                                            | 8                | Thickness of background line                                                                                                                                                                                                                                      |
| spaceBetweenSegments        | number                                                                            | 2                | Space between segments                                                                                                                                                                                                                                            |
| arcDegree                   | number                                                                            | 180              | Degree of arc                                                                                                                                                                                                                                                     |
| radius                      | number                                                                            | 100              | Arc radius                                                                                                                                                                                                                                                        |
| isAnimated                  | bool                                                                              | true             | Enable/disable progress animation                                                                                                                                                                                                                                 |
| animationDuration           | number                                                                            | 1000             | Progress animation duration                                                                                                                                                                                                                                       |
| animationDelay              | number                                                                            | 0                | Progress animation delay                                                                                                                                                                                                                                          |
| ranges                      | Array of strings                                                                  | []               | Arc ranges (segments) display values                                                                                                                                                                                                                              |
| rangesTextColor             | string                                                                            | '#000000'        | Color of ranges text                                                                                                                                                                                                                                              |
| rangesTextStyle             | object                                                                            | { fontSize: 12 } | Ranges text styling                                                                                                                                                                                                                                               |
| showArcRanges               | bool                                                                              | false            | Show/hide arc ranges                                                                                                                                                                                                                                              |
| middleContentContainerStyle | object                                                                            | {}               | Extra styling for the middle content container                                                                                                                                                                                                                    |
| capInnerColor               | string                                                                            | '#28E037'        | Cap's inner color                                                                                                                                                                                                                                                 |
| capOuterColor               | string                                                                            | '#FFFFFF'        | Cap's outer color                                                                                                                                                                                                                                                 |
| children                    | function                                                                          |                  | Pass a function as a child. It receives metaData with the last filled segment's data as an argument. From there you can extract data object. See example above.                                                                                                   |
|                             |

# 📄 License

MIT
