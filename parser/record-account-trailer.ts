import { ATErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_ACCOUNT_TRAILER } from '../models';

export class RecordAccountTrailer {
  public static parse(data: string) {
    let line = '';
    let read = 0;

    let trailerData = {} as IBAI2_ACCOUNT_TRAILER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(ATErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    if (RecordCodesEnum.AccountTrailerCode !== data.slice(0, 2)) {
      return Util.returnFieldError(ATErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // AccountControlTotal
    const accountControlTotal = Reader.field(line, read);
    if (accountControlTotal.error) {
      return Util.returnFieldError(ATErrorMsgEnum.PARSE, 'AccountControlTotal');
    } else {
      read += accountControlTotal.newStart;
      trailerData = { ...trailerData, accountControlTotal: accountControlTotal.value };
    }

    // NumberRecords
    const numberRecords = Reader.fieldAsInt(line, read);
    if (numberRecords.error) {
      return Util.returnFieldError(ATErrorMsgEnum.PARSE, 'NumberRecords');
    } else {
      read += numberRecords.newStart;
      trailerData = { ...trailerData, numberRecords: numberRecords.value };
    }

    const trailerErr = RecordAccountTrailer.validate(trailerData);
    if (trailerErr) {
      return Util.returnParserError(trailerErr.error.message);
    }

    return Util.returnValue<IBAI2_ACCOUNT_TRAILER>(trailerData);
  }

  private static validate(trailerData: IBAI2_ACCOUNT_TRAILER) {
    if (
      trailerData.accountControlTotal !== '' &&
      !Validator.Amount(trailerData.accountControlTotal)
    ) {
      return Util.returnFieldError(ATErrorMsgEnum.VALIDATE, 'Amount');
    }
    return null;
  }
}
