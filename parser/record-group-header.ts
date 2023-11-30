import { GHErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_GROUP_HEADER } from '../models';

export class GroupHeader {
  public static parse(data: string) {

    let line = '';
    let read = 0;
    let headerData = {} as IBAI2_GROUP_HEADER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    // RecordCode
    if (RecordCodesEnum.GroupHeaderCode !== data.slice(0, 2)) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // Receiver
    const receiver = Reader.field(line, read);
    if (receiver.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'Receiver');
    } else {
      read += receiver.newStart;
      headerData = { ...headerData, receiver: receiver.value };
    }

    // Originator
    const originator = Reader.field(line, read);
    if (originator.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'Originator');
    } else {
      read += originator.newStart;
      headerData = { ...headerData, originator: originator.value };
    }

    // GroupStatus
    const groupStatus = Reader.fieldAsInt(line, read);
    if (groupStatus.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'GroupStatus');
    } else {
      read += groupStatus.newStart;
      headerData = { ...headerData, groupStatus: groupStatus.value };
    }

    // AsOfDate
    const asOfDate = Reader.field(line, read);
    if (asOfDate.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'AsOfDate');
    } else {
      read += asOfDate.newStart;
      headerData = { ...headerData, asOfDate: asOfDate.value };
    }

    // AsOfTime
    const asOfTime = Reader.field(line, read);
    if (asOfTime.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'AsOfTime');
    } else {
      read += asOfTime.newStart;
      headerData = { ...headerData, asOfTime: asOfTime.value };
    }

    // CurrencyCode
    const currencyCode = Reader.field(line, read);
    if (currencyCode.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'CurrencyCode');
    } else {
      read += currencyCode.newStart;
      headerData = { ...headerData, currencyCode: currencyCode.value };
    }

    // AsOfDateModifier
    const asOfDateModifier = Reader.fieldAsInt(line, read);
    if (asOfDateModifier.error) {
      return Util.returnFieldError(GHErrorMsgEnum.PARSE, 'AsOfDateModifier');
    } else {
      read += asOfDateModifier.newStart;
      headerData = { ...headerData, asOfDateModifier: asOfDateModifier.value };
    }

    const headerErr = GroupHeader.validate(headerData);
    if (headerErr) {
      return Util.returnParserError(headerErr.error.message);
    }

    return Util.returnValue<IBAI2_GROUP_HEADER>(headerData);
  }

  private static validate(headerData: IBAI2_GROUP_HEADER) {
    if (headerData.originator === '') {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'Originator');
    }
    if (headerData.groupStatus < 0 || headerData.groupStatus > 4) {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'GroupStatus');
    }
    if (headerData.asOfDate === '' || !Validator.Date(headerData.asOfDate)) {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'AsOfDate');
    }
    if (headerData.asOfTime && !Validator.Time(headerData.asOfTime)) {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'AsOfTime');
    }
    if (
      headerData.currencyCode &&
      !Validator.CurrencyCode(headerData.currencyCode)
    ) {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'CurrencyCode');
    }
    if (!headerData.asOfDateModifier || headerData.asOfDateModifier < 0 || headerData.asOfDateModifier > 4) {
      return Util.returnFieldError(GHErrorMsgEnum.VALIDATE, 'AsOfDateModifier');
    }
    return null;
  }
}
