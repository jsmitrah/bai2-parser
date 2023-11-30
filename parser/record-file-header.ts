import { FHErrorMsgEnum, RecordCodesEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_FILE_HEADER } from '../models';

export class FileHeader {
  public static parse(data: string) {

    let line = '';
    let read = 0;
    let headerData = {} as IBAI2_FILE_HEADER;

    const length = data.length;
    if (length < 3) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'record');
    } else {
      line = data.slice(0, length);
      ;
    }

    // RecordCode
    if (RecordCodesEnum.FileHeaderCode !== data.slice(0, 2)) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'RecordCode');
    }
    read += 3;

    // Sender
    const sender = Reader.field(line, read);
    if (sender.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'Sender');
    } else {
      read += sender.newStart;
      headerData = { ...headerData, sender: sender.value };
    }

    // Receiver
    const receiver = Reader.field(line, read);
    if (receiver.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'Receiver');
    } else {
      read += receiver.newStart;
      headerData = { ...headerData, receiver: receiver.value };
    }

    // FileCreatedDate
    const fileCreatedDate = Reader.field(line, read);
    if (fileCreatedDate.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'FileCreatedDate');
    } else {
      read += fileCreatedDate.newStart;
      headerData = { ...headerData, fileCreatedDate: fileCreatedDate.value };
    }

    // FileCreatedTime
    const fileCreatedTime = Reader.field(line, read);
    if (fileCreatedTime.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'FileCreatedTime');
    } else {
      read += fileCreatedTime.newStart;
      headerData = { ...headerData, fileCreatedTime: fileCreatedTime.value };
    }

    // FileIdNumber
    const fileIdNumber = Reader.field(line, read);
    if (fileIdNumber.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'FileIdNumber');
    } else {
      read += fileIdNumber.newStart;
      headerData = { ...headerData, fileIdNumber: fileIdNumber.value };
    }

    // PhysicalRecordLength
    const physicalRecordLength = Reader.fieldAsInt(line, read);
    if (physicalRecordLength.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'PhysicalRecordLength');
    } else {
      read += physicalRecordLength.newStart;
      headerData = {
        ...headerData,
        physicalRecordLength: physicalRecordLength.value,
      };
    }

    // BlockSize
    const blockSize = Reader.fieldAsInt(line, read);
    if (blockSize.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'BlockSize');
    } else {
      read += blockSize.newStart;
      headerData = { ...headerData, blockSize: blockSize.value };
    }

    // VersionNumber
    const versionNumber = Reader.fieldAsInt(line, read);
    if (versionNumber.error) {
      return Util.returnFieldError(FHErrorMsgEnum.PARSE, 'VersionNumber');
    } else {
      read += versionNumber.newStart;
      headerData = { ...headerData, versionNumber: versionNumber.value };
    }

    const headerErr = FileHeader.validate(headerData);
    if (headerErr) {
      return Util.returnParserError(headerErr.error.message);
    }

    return Util.returnValue<IBAI2_FILE_HEADER>(headerData);
  }

  private static validate(headerData: IBAI2_FILE_HEADER) {
    if (headerData.sender === '') {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'Sender');
    }
    if (headerData.receiver === '') {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'Receiver');
    }
    if (headerData.fileCreatedDate === '' || !Validator.Date(headerData.fileCreatedDate)) {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'FileCreatedDate');
    }
    if (headerData.fileCreatedTime === '' || !Validator.Time(headerData.fileCreatedTime)) {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'FileCreatedDate');
    }
    if (headerData.fileIdNumber === '') {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'FileIdNumber');
    }
    if (headerData.versionNumber !== 2) {
      return Util.returnFieldError(FHErrorMsgEnum.VALIDATE, 'VersionNumber');
    }
    return null;
  }
}
