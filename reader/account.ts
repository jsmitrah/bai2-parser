import { RecordCodesEnum } from '../enums';
import { Util } from '../helpers';
import { IBAI2_ACCOUNT, IBAI2_READER_RESPONSE, IBAI2_TRANSACTION_DETAIL } from '../models';
import { RecordAccountIdentifier, RecordAccountTrailer } from '../parser';
import { Detail } from './detail';

export class Account {

  public static read(lines: string[], lineIndex: number): IBAI2_READER_RESPONSE<IBAI2_ACCOUNT> {
    let output = {} as IBAI2_ACCOUNT;

    let find = false;
    let isBreak = false;

    for (let lineIdx = lineIndex; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;

      if (line.length < 3) continue;

      const recordCode = line.slice(0, 2);
      switch (recordCode) {
        case RecordCodesEnum.AccountIdentifierCode: {
          if (find) {
            isBreak = true;
            break;
          }
          find = true;

          const accountIdentifier = RecordAccountIdentifier.parse(line);
          if (accountIdentifier.error) {
            return Util.returnReaderError(
              `Reading ACCOUNT :: AccountIdentifier(${RecordCodesEnum.AccountIdentifierCode}) on line ${lineIdx + 1} :: (${accountIdentifier.error.message})`,
            );
          }
          output = { ...output, ...accountIdentifier.value };

          break;
        }

        case RecordCodesEnum.ContinuationCode: {
          break;
        }

        case RecordCodesEnum.AccountTrailerCode: {
          const accountTrailer = RecordAccountTrailer.parse(line);
          if (accountTrailer.error) {
            return Util.returnReaderError(
              `Reading ACCOUNT :: AccountTrailer(${RecordCodesEnum.AccountTrailerCode}) on line ${lineIdx + 1} :: (${accountTrailer.error.message})`,
            );
          }
          output = { ...output, ...accountTrailer.value };

          break;
        }

        case RecordCodesEnum.TransactionDetailCode: {
          const detail: IBAI2_READER_RESPONSE<IBAI2_TRANSACTION_DETAIL> = Detail.read(lines, lineIdx);
          if (detail.error) {
            return Util.returnReaderError(detail.error.message);
          }
          output = { ...output, details: [...(output.details || []), detail.value] };

          break;
        }

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
