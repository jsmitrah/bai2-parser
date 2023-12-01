import fs from 'fs'
import { BAI2 } from '../index'

const fileString = fs.readFileSync(`../input/sample.bai`).toString()

// You can get the parsed answer from file using below prop.

const parsefromFile = BAI2.fromFile(`../input/sample.bai`, { output: 'JSON' })

console.log('parsefromFile', parsefromFile)

// You can get the parsed answer from file string using below prop.

const parsefromString = BAI2.fromString(fileString, { output: 'CSV' })

console.log('parsefromString', parsefromString)

// fs.writeFile(`../output/sample.json`, JSON.stringify(parsefromString, null, 2), 'utf8', function (err) {
//     if (err) {
//         console.log('write file error', err)
//     }
//     console.log(`sample.json file Saved Successfully!!`);
// });

