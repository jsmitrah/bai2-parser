import { IBAI2_ACCOUNT, IBAI2_FILE, IBAI2_FLAT_TRANSACTIONS, IBAI2_GROUP, IBAI2_READER_RESPONSE, IBAI2_TRANSACTION_DETAIL } from '../models';

export class Util {
  public static returnValue<T>(value: T) {
    return {
      value,
      error: null,
    };
  }

  public static returnFieldError(message: string, field: string) {
    return {
      value: null,
      error: new Error(`${message} :: ${field}`),
      newStart: 0
    };
  }

  public static returnReaderError(message: string) {
    return {
      value: null,
      error: new Error(`ERROR :: ${message}`),
      newStart: 0
    };
  }

  public static returnParserError(message: string) {
    return {
      value: null,
      error: new Error(message),
      newStart: 0
    };
  }

  public static getFlattenTransactions = (parsedData: IBAI2_FILE): IBAI2_READER_RESPONSE<IBAI2_FLAT_TRANSACTIONS[]> => {
    let output: IBAI2_FLAT_TRANSACTIONS[] = [];
    parsedData?.groups?.forEach((group: IBAI2_GROUP) => {
      group?.accounts?.forEach((acc: IBAI2_ACCOUNT) => {
        if (acc?.details?.length) {
          let txns = acc.details.map((detail: IBAI2_TRANSACTION_DETAIL) => {
            const txnAmount = detail?.amount as unknown as number;
            return {
              BankIdentifier: parsedData.sender,
              FileIdNumber: parsedData.fileIdNumber,
              TransactionDate: parsedData.fileCreatedDate,
              BankAcctNumber: acc.accountNumber,
              Currency: acc.currencyCode ?? 'USD',
              TxnTypeCode: detail.typeCode ?? '',
              TxnAmount: (txnAmount && txnAmount > 0) ? (txnAmount / 100) : 0,
              BankReference: detail.bankReferenceNumber ?? '',
              CustomerReference: detail.customerReferenceNumber ?? '',
              Comment: detail.text ?? '',
              Sender: detail?.Sender ?? '',
              Receiver: detail?.Receiver ?? '',
              Tracer: detail?.Tracer ?? '',
              IMAD: detail?.IMAD ?? '',
              VirtualAccount: detail?.VirtualAccount ?? '',
            };
          });
          output = [...output, ...txns];
        }
      });
    });
    return Util.returnValue(output);
  };
}
