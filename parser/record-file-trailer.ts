import { FTErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_FILE_TRAILER } from '../models';

export class FileTrailer {
  public static parse(data: string) {
    let line = '';
    let read = 0;
    let trailerData = {} as IBAI2_FILE_TRAILER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(FTErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    // RecordCode
    if (RecordCodesEnum.FileTrailerCode !== data.slice(0, 2)) {
      return Util.returnFieldError(FTErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // GroupControlTotal
    const fileControlTotal = Reader.field(line, read);
    if (fileControlTotal.error) {
      return Util.returnFieldError(FTErrorMsgEnum.PARSE, 'GroupControlTotal');
    } else {
      read += fileControlTotal.newStart;
      trailerData = {
        ...trailerData,
        fileControlTotal: fileControlTotal.value,
      };
    }

    // NumberOfGroups
    const numberOfGroups = Reader.fieldAsInt(line, read);
    if (numberOfGroups.error) {
      return Util.returnFieldError(FTErrorMsgEnum.PARSE, 'NumberOfGroups');
    } else {
      read += numberOfGroups.newStart;
      trailerData = {
        ...trailerData,
        numberOfGroups: numberOfGroups.value,
      };
    }

    // NumberOfRecords
    const numberOfRecords = Reader.fieldAsInt(line, read);
    if (numberOfRecords.error) {
      return Util.returnFieldError(FTErrorMsgEnum.PARSE, 'NumberOfRecords');
    } else {
      read += numberOfRecords.newStart;
      trailerData = {
        ...trailerData,
        numberOfRecords: numberOfRecords.value,
      };
    }

    const trailerErr = FileTrailer.validate(trailerData);
    if (trailerErr) {
      return Util.returnParserError(trailerErr.error.message);
    }

    return Util.returnValue<IBAI2_FILE_TRAILER>(trailerData);
  }

  private static validate(trailerData: IBAI2_FILE_TRAILER) {
    if (
      trailerData.fileControlTotal !== '' &&
      !Validator.Amount(trailerData.fileControlTotal)
    ) {
      return Util.returnFieldError(FTErrorMsgEnum.VALIDATE, 'FileControlTotal');
    }

    return null;
  }
}
