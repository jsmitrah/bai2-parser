import { RecordCodesEnum } from '../enums';
import { Util } from '../helpers';
import { IBAI2_READER_RESPONSE, IBAI2_TRANSACTION_DETAIL } from '../models';
import { Continuation } from '../parser/record-continuation';
import { TransactionDetail } from '../parser/record-transaction-detail';

export class Detail {

  public static read(lines: string[], lineIndex: number): IBAI2_READER_RESPONSE<IBAI2_TRANSACTION_DETAIL> {
    var rawData = '';
    var find = false;
    var isBreak = false;

    let output = {} as IBAI2_TRANSACTION_DETAIL;
    for (let lineIdx = lineIndex; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;

      if (line.length < 3) continue;

      const recordCode = line.slice(0, 2);
      switch (recordCode) {
        case RecordCodesEnum.TransactionDetailCode:
          if (find) {
            isBreak = true;
            break;
          }
          rawData = line;
          find = true;
          const transactionDetail = TransactionDetail.parse(rawData);
          if (transactionDetail.error) {
            return Util.returnReaderError(
              `Reading DETAIL :: Transaction(${RecordCodesEnum.TransactionDetailCode}) on line ${lineIdx + 1} :: (${transactionDetail.error.message})`,
            );
          }
          output = { ...output, ...transactionDetail.value };

          break;
        case RecordCodesEnum.ContinuationCode:
          const continuedData = Continuation.parse(line);
          if (continuedData.error) {
            return Util.returnReaderError(
              `Reading DETAIL :: Continuation(${RecordCodesEnum.ContinuationCode}) on line ${lineIdx + 1} :: (${continuedData.error.message})`,
            );
          }
          output = { ...output, ...continuedData.value };

          break;
        default:
          break;
      }
      if (isBreak) {
        break;
      }
    }

    return Util.returnValue(output);
  }
}
