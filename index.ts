import fs from 'fs'
import converter from 'json-2-csv'
import * as _BAI2Enums from './enums';
import * as _BAI2Models from './models';
import * as _Reader from './reader';

export type BAI2Options = {
  output?: 'JSON' | 'CSV';
}

namespace BAI_FILE {
  export import Enums = _BAI2Enums;
  export import Models = _BAI2Models;
  export namespace Reader {
    export import File = _Reader.File;
  }
}

function getParsedValue(fileString: string, options: BAI2Options) {
  const parser = BAI_FILE.Reader.File.read(fileString);
  const data = parser.value as object[]
  if (options.output === 'CSV') {
    const csv = converter.json2csv(data);
    return csv
  } else {
    return JSON.stringify(data)
  }
}

export namespace BAI2 {
  export function fromString(fileString: string, options: BAI2Options = {}): any {
    try {
      const res = getParsedValue(fileString, options)
      return res
    } catch (error) {
      return (error as Error).message
    }
  }
}

export namespace BAI2 {
  export function fromFile(filePath: string, options: BAI2Options = {}): any {
    try {
      const fileString: string = fs.readFileSync(filePath).toString();
      const res = getParsedValue(fileString, options)
      return res
    } catch (error) {
      return (error as Error).message
    }
  }
}


