import { RecordCodesEnum, TDErrorMsgEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_TRANSACTION_DETAIL } from '../models';
import { FundsType } from './funds-type';

export class TransactionDetail {
  public static validate(data: IBAI2_TRANSACTION_DETAIL) {
    if (data.typeCode !== '' && !Validator.TypeCode(data.typeCode)) {
      return Util.returnFieldError(TDErrorMsgEnum.VALIDATE, 'TypeCode');
    }
    if (data.amount && !Validator.Amount(data.amount)) {
      return Util.returnFieldError(TDErrorMsgEnum.VALIDATE, 'Amount');
    }
    return null;
  }

  public static parse(data: string) {

    let line = '';
    let read = 0;
    let txnData = {} as IBAI2_TRANSACTION_DETAIL;

    const length = data.length;

    if (length < 3) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
    }

    if (RecordCodesEnum.TransactionDetailCode !== data.slice(0, 2)) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // TypeCode
    const typeCode = Reader.field(line, read);
    if (typeCode.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'TypeCode');
    } else {
      read += typeCode.newStart;
      txnData = {
        ...txnData,
        typeCode: typeCode.value,
      };
    }

    // Amount
    const amount = Reader.field(line, read);
    if (amount.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, `Amount`);
    } else {
      read += amount.newStart;
      txnData = {
        ...txnData,
        amount: amount.value,
      };
    }

    // fundsTypeSize
    const fundsTypeSize = FundsType.parse(line.slice(read));
    if (fundsTypeSize.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, `FundsType :: ${fundsTypeSize.error.message}`);
    } else {
      read += fundsTypeSize.newStart;
      txnData = {
        ...txnData,
        fundsTypeSize: fundsTypeSize.value,
      };
    }

    // BankReferenceNumber
    const bankReferenceNumber = Reader.field(line, read);
    if (bankReferenceNumber.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'BankReferenceNumber');
    } else {
      read += bankReferenceNumber.newStart;
      txnData = {
        ...txnData,
        bankReferenceNumber: bankReferenceNumber.value,
      };
    }

    // CustomerReferenceNumber
    const customerReferenceNumber = Reader.field(line, read);

    if (customerReferenceNumber.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'CustomerReferenceNumber');
    } else {
      read += customerReferenceNumber.newStart;
      txnData = {
        ...txnData,
        customerReferenceNumber: customerReferenceNumber.value,
      };
    }

    // Text
    const text = Reader.field(line, read, true);
    if (text.error) {
      return Util.returnFieldError(TDErrorMsgEnum.PARSE, 'Text');
    } else {
      read += text.newStart;
      txnData = {
        ...txnData,
        text: text.value,
      };
    }

    const txnErr = TransactionDetail.validate(txnData);
    if (txnErr) {
      return Util.returnParserError(txnErr.error.message);
    }

    return Util.returnValue<IBAI2_TRANSACTION_DETAIL>(txnData);
  }
}

