import * as _BAI2Enums from './enums';
import * as _BAI2Models from './models';
import * as _Reader from './reader';
import fs from 'fs'

namespace BAI_FILE {
  export import Enums = _BAI2Enums;
  export import Models = _BAI2Models;
  export namespace Reader {
    export import File = _Reader.File;
  }
}

export namespace BAI2 {
  export function fromString(fileString: string): any {
    return BAI_FILE.Reader.File.read(fileString);
  }
}

export namespace BAI2 {
  export function fromFile(filePath: string): any {
    const fileString: string = fs.readFileSync(filePath).toString();
    return BAI_FILE.Reader.File.read(fileString);
  }
}

// export { BAI2 };
