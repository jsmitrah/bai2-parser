import { RecordCodesEnum } from '../enums';
import { Util } from '../helpers';
import { IBAI2_ACCOUNT, IBAI2_GROUP, IBAI2_READER_RESPONSE } from '../models';
import { GroupHeader, GroupTrailer } from '../parser';
import { Account } from './account';

export class Group {
  public static read(lines: string[], lineIndex: number): IBAI2_READER_RESPONSE<IBAI2_GROUP> {
    let output = {} as IBAI2_GROUP;

    for (let lineIdx = lineIndex; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;

      if (line.length < 3) continue;

      const recordCode = line.slice(0, 2);
      switch (recordCode) {
        case RecordCodesEnum.GroupHeaderCode: {
          const groupHeader = GroupHeader.parse(line);

          if (groupHeader.error) {
            return Util.returnReaderError(
              `Reading GROUP :: GroupHeader(${RecordCodesEnum.GroupHeaderCode}) on line ${lineIdx + 1} :: (${groupHeader.error.message})`,
            );
          }
          output = { ...output, ...groupHeader.value };

          break;
        }
        case RecordCodesEnum.AccountIdentifierCode: {
          const accountData: IBAI2_READER_RESPONSE<IBAI2_ACCOUNT> = Account.read(lines, lineIdx);

          if (accountData.error) {
            return Util.returnReaderError(
              `Reading GROUP :: AccountIdentifier(${RecordCodesEnum.AccountIdentifierCode}) on line ${lineIdx + 1} :: (${accountData.error.message})`,
            );
          }
          output = {
            ...output,
            accounts: [...(output.accounts || []), accountData.value],
          };

          break;
        }
        case RecordCodesEnum.GroupTrailerCode: {
          const groupTrailer = GroupTrailer.parse(line);

          if (groupTrailer.error) {
            return Util.returnReaderError(
              `Reading GROUP :: GroupTrailer(${RecordCodesEnum.GroupTrailerCode}) on line ${lineIdx + 1} :: (${groupTrailer.error.message})`,
            );
          }
          output = { ...output, ...groupTrailer.value };

          break;
        }
        default:
          break;
      }
    }
    return Util.returnValue(output);
  }
}
