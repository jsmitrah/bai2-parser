import { CNErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util } from '../helpers';
import { IBAI2_CONTINUATION_RECORD, IBAI2_READER_RESPONSE } from '../models';

export class Continuation {
  public static parse(data: string): IBAI2_READER_RESPONSE<IBAI2_CONTINUATION_RECORD> {
    let line = '';
    let read = 0;
    let continuedData = {} as IBAI2_CONTINUATION_RECORD;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(CNErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    // RecordCode
    if (RecordCodesEnum.ContinuationCode !== data.slice(0, 2)) {
      return Util.returnFieldError(CNErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // Continuation extra data Key
    const key = Reader.field(line, read);
    if (key.error) {
      return Util.returnFieldError(CNErrorMsgEnum.PARSE, 'Key');
    } else {
      read += key.newStart;
      continuedData = {
        ...continuedData,
        [key.value]: '',
      };
    }

    // Continuation extra data Key
    const value = Reader.field(line, read);
    if (value.error) {
      return Util.returnFieldError(CNErrorMsgEnum.PARSE, 'Value');
    } else {
      read += value.newStart;
      continuedData = {
        ...continuedData,
        [key.value]: value.value,
      };
    }

    return Util.returnValue<IBAI2_CONTINUATION_RECORD>(continuedData);
  }
}
