import { GTErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_GROUP_TRAILER } from '../models';

export class GroupTrailer {
  public static parse(data: string) {
    let line = '';
    let read = 0;

    let trailerData = {} as IBAI2_GROUP_TRAILER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(GTErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    // RecordCode
    if (RecordCodesEnum.GroupTrailerCode !== data.slice(0, 2)) {
      return Util.returnFieldError(GTErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // GroupControlTotal
    const groupControlTotal = Reader.field(line, read);
    if (groupControlTotal.error) {
      return Util.returnFieldError(GTErrorMsgEnum.PARSE, 'GroupControlTotal');
    } else {
      read += groupControlTotal.newStart;
      trailerData = {
        ...trailerData,
        groupControlTotal: groupControlTotal.value,
      };
    }

    // NumberOfAccounts
    const numberOfAccounts = Reader.fieldAsInt(line, read);
    if (numberOfAccounts.error) {
      return Util.returnFieldError(GTErrorMsgEnum.PARSE, 'NumberOfAccounts');
    } else {
      read += numberOfAccounts.newStart;
      trailerData = {
        ...trailerData,
        numberOfAccounts: numberOfAccounts.value,
      };
    }

    // NumberRecords
    const numberRecords = Reader.fieldAsInt(line, read);
    if (numberRecords.error) {
      return Util.returnFieldError(GTErrorMsgEnum.PARSE, 'NumberRecords');
    } else {
      read += numberRecords.newStart;
      trailerData = {
        ...trailerData,
        numberRecords: numberRecords.value,
      };
    }

    const trailerErr = GroupTrailer.validate(trailerData);
    if (trailerErr) {
      return Util.returnParserError(trailerErr.error.message);
    }

    return Util.returnValue<IBAI2_GROUP_TRAILER>(trailerData);
  }

  private static validate(trailerData: IBAI2_GROUP_TRAILER) {
    if (
      trailerData.groupControlTotal !== '' &&
      !Validator.Amount(trailerData.groupControlTotal)
    ) {
      return Util.returnFieldError(GTErrorMsgEnum.VALIDATE, 'GroupControlTotal');
    }
    return null;
  }
}
