import { AIErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_ACCOUNT_IDENTIFIER } from '../models';
import { FundsType } from './funds-type';

export class RecordAccountIdentifier {
  public static parse(data: string) {
    let line = '';
    let read = 0;
    let identifierData = {} as IBAI2_ACCOUNT_IDENTIFIER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    // RecordCode
    if (RecordCodesEnum.AccountIdentifierCode !== data.slice(0, 2)) {
      return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // AccountNumber
    const accountNumber = Reader.field(line, read);
    if (accountNumber.error) {
      return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'AccountNumber');
    } else {
      read += accountNumber.newStart;
      identifierData = {
        ...identifierData,
        accountNumber: accountNumber.value,
      };
    }

    // CurrencyCode
    const currencyCode = Reader.field(line, read);
    if (currencyCode.error) {
      return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'CurrencyCode');
    } else {
      read += currencyCode.newStart;
      identifierData = {
        ...identifierData,
        currencyCode: currencyCode.value,
      };
    }

    while (read < data.length) {
      let summary = {};

      // TypeCode
      const typeCode = Reader.field(line, read);
      if (typeCode.error) {
        return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'TypeCode');
      } else {
        read += typeCode.newStart;
        summary = { ...summary, typeCode: typeCode.value };
      }

      // Amount
      const amount = Reader.field(line, read);
      if (amount.error) {
        return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'Amount');
      } else {
        read += amount.newStart;
        summary = { ...summary, amount: amount.value };
      }

      // ItemCount
      const itemCount = Reader.fieldAsInt(line, read);
      if (itemCount.error) {
        return Util.returnFieldError(AIErrorMsgEnum.PARSE, 'ItemCount');
      } else {
        read += itemCount.newStart;
        summary = { ...summary, itemCount: itemCount.value };
      }

      // FundsType
      const fundsType = FundsType.parse(line.slice(read));
      if (fundsType.error) {
        return Util.returnFieldError(
          AIErrorMsgEnum.PARSE,
          `FundsType :: ${fundsType.error.message}`,
        );
      } else {
        read += fundsType.newStart;
        summary = { ...summary, fundsType: fundsType.value };
      }
      identifierData = {
        ...identifierData,
        summaries: [...(identifierData.summaries || []), summary],
      };
    }

    const identifierErr = RecordAccountIdentifier.validate(identifierData);
    if (identifierErr) {
      return Util.returnParserError(identifierErr.error.message);
    }

    return Util.returnValue<IBAI2_ACCOUNT_IDENTIFIER>(identifierData);
  }

  private static validate(data: IBAI2_ACCOUNT_IDENTIFIER) {
    if (data.accountNumber === '') {
      return Util.returnFieldError(
        AIErrorMsgEnum.VALIDATE,
        'AccountNumber',
      );
    }
    if (data.currencyCode && !Validator.CurrencyCode(data.currencyCode)) {
      return Util.returnFieldError(
        AIErrorMsgEnum.VALIDATE,
        'CurrencyCode',
      );
    }

    for (const summary of data.summaries) {
      if (summary.amount && !Validator.Amount(summary.amount)) {
        return Util.returnFieldError(AIErrorMsgEnum.VALIDATE, 'Amount');
      }
      if (summary.typeCode && !Validator.TypeCode(summary.typeCode)) {
        return Util.returnFieldError(AIErrorMsgEnum.VALIDATE, 'TypeCode');
      }
    }
    return null;
  }
}
