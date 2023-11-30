import { RecordCodesEnum } from '../enums';
import { Util } from '../helpers';
import { IBAI2_FILE, IBAI2_FLAT_TRANSACTIONS, IBAI2_GROUP, IBAI2_READER_RESPONSE } from '../models';
import { FileHeader, FileTrailer } from '../parser';
import { Group } from './group';

export class File {

  public static read(bai2Data: string): IBAI2_READER_RESPONSE<IBAI2_FLAT_TRANSACTIONS[] | IBAI2_FILE> {
    let output = {} as IBAI2_FILE;

    const lines = bai2Data.split('\n');

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      if (!line) continue;

      if (line.length < 3) continue;

      const recordCode = line.slice(0, 2);

      switch (recordCode) {
        case RecordCodesEnum.FileHeaderCode: {
          const fileHeader = FileHeader.parse(line);
          if (fileHeader.error) {
            return Util.returnReaderError(
              `Reading FILE :: FileHeader(${RecordCodesEnum.FileHeaderCode}) on line ${lineIdx + 1} :: (${
                fileHeader.error.message
              })`,
            );
          }
          output = { ...output, ...fileHeader.value };

          break;
        }
        case RecordCodesEnum.GroupHeaderCode: {
          const groupData: IBAI2_READER_RESPONSE<IBAI2_GROUP> = Group.read(lines, lineIdx);
          if (groupData.error) {
            return Util.returnReaderError(
              `Reading FILE :: GroupHeader(${RecordCodesEnum.GroupHeaderCode}) on line ${lineIdx + 1} :: (${
                groupData.error.message
              })`,
            );
          }
          output = {
            ...output,
            groups: [...(output.groups || []), groupData.value],
          };

          break;
        }
        case RecordCodesEnum.FileTrailerCode: {
          const fileTrailer = FileTrailer.parse(line);
          if (fileTrailer.error) {
            return Util.returnReaderError(
              `Reading FILE :: FileTrailer(${RecordCodesEnum.FileTrailerCode}) on line ${lineIdx + 1} :: (${
                fileTrailer.error.message
              })`,
            );
          }
          output = { ...output, ...fileTrailer.value };

          break;
        }
        default:
          continue;
      }
    }
    const flatTxns = Util.getFlattenTransactions(output);
    if (flatTxns.error) {
      return Util.returnReaderError(flatTxns.error.message);
    }

    return Util.returnValue<IBAI2_FLAT_TRANSACTIONS[]>(flatTxns.value);
  }
}
