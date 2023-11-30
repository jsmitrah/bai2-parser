import { FundsTypeEnum, FUTYErrorMsgEnum } from '../enums';
import { Reader, Util, Validator } from '../helpers';
import { IBAI2_FUNDS_TYPE } from '../models';

export class FundsType {
  public static validate(funds: IBAI2_FUNDS_TYPE) {
    const fundsTypeCodeErr = FundsType.typeCodeValidate(funds.typeCode);

    if (fundsTypeCodeErr) {
      return fundsTypeCodeErr;
    }
    if (
      funds.typeCode.toUpperCase() === FundsTypeEnum.DISTRIBUTED_AVAILABILITY &&
      funds.distributionNumber !== funds.distributions?.length
    ) {
      return Util.returnFieldError(FUTYErrorMsgEnum.VALIDATE, `number of distributions is not match`);
    }
    if (funds.typeCode.toUpperCase() === FundsTypeEnum.VALUE_DATED) {
      if (funds.date && !Validator.Date(funds.date)) {
        return Util.returnFieldError(
          FUTYErrorMsgEnum.VALIDATE,
          `date of fund type V ( ${funds.date} )`,
        );
      }
      if (funds.time && !Validator.Time(funds.time)) {
        return Util.returnFieldError(
          FUTYErrorMsgEnum.VALIDATE,
          `time of fund type V ( ${funds.time} )`,
        );
      }
    }
    return null;
  }

  public static parse(data: string) {
    let read = 0;
    let fundsTypeData = {} as IBAI2_FUNDS_TYPE;
    const typeCode = Reader.field(data, read);
    if (typeCode.error) {
      return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'type code');
    } else {
      read += typeCode.newStart;
      fundsTypeData = { ...fundsTypeData, typeCode: typeCode.value as FundsTypeEnum };
    }

    if (typeCode.value === FundsTypeEnum.DISTRIBUTED_AVAILABILITY_THREE) {
      // ImmediateAmount
      const immediateAmount = Reader.fieldAsInt(data, read);
      if (immediateAmount.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'ImmediateAmount');
      } else {
        read += immediateAmount.newStart;
        fundsTypeData = {
          ...fundsTypeData,
          immediateAmount: immediateAmount.value,
        };
      }

      // OneDayAmount
      const oneDayAmount = Reader.fieldAsInt(data, read);
      if (oneDayAmount.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'OneDayAmount');
      } else {
        read += oneDayAmount.newStart;
        fundsTypeData = { ...fundsTypeData, oneDayAmount: oneDayAmount.value };
      }

      // TwoDayAmount
      const twoDayAmount = Reader.fieldAsInt(data, read);
      if (twoDayAmount.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'TwoDayAmount');
      } else {
        read += twoDayAmount.newStart;
        fundsTypeData = { ...fundsTypeData, twoDayAmount: twoDayAmount.value };
      }
    } else if (typeCode.value === FundsTypeEnum.VALUE_DATED) {
      // Date
      const date = Reader.field(data, read);
      if (date.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'Date');
      } else {
        read += date.newStart;
        fundsTypeData = { ...fundsTypeData, date: date.value };
      }

      // Time
      const time = Reader.field(data, read);
      if (time.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'Time');
      } else {
        read += time.newStart;
        fundsTypeData = { ...fundsTypeData, time: time.value };
      }
    } else if (typeCode.value === FundsTypeEnum.DISTRIBUTED_AVAILABILITY) {
      // DistributionNumber
      const distributionNumber = Reader.fieldAsInt(data, read);
      if (distributionNumber.error) {
        return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'DistributionNumber');
      } else {
        read += distributionNumber.newStart;
        fundsTypeData = {
          ...fundsTypeData,
          distributionNumber: distributionNumber.value,
        };
      }
      for (let distIdx = 0; distIdx < distributionNumber.value; distIdx++) {
        let distribution = {};
        // day
        const day = Reader.fieldAsInt(data, read);
        if (day.error) {
          return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'day');
        } else {
          read += day.newStart;
          distribution = {
            ...distribution,
            day: day.value,
          };
        }

        const amount = Reader.fieldAsInt(data, read);
        if (amount.error) {
          return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'amount');
        } else {
          read += amount.newStart;
          distribution = {
            ...distribution,
            amount: amount.value,
          };
        }
        fundsTypeData = {
          ...fundsTypeData,
          distributions: [...(fundsTypeData.distributions || []), distribution],
        };
      }
    }
    if (data.slice(0, read - 1).includes('/')) {
      return Util.returnFieldError(FUTYErrorMsgEnum.PARSE, 'sub elements');
    }

    const fundsTypeErr = FundsType.validate(fundsTypeData);
    if (fundsTypeErr) {
      return { error: fundsTypeErr.error, value: null, newStart: read };
    }
    return { error: null, value: fundsTypeData, newStart: read };
  }

  private static typeCodeValidate(typeCode: FundsTypeEnum) {
    const availableTypes = Object.values(FundsTypeEnum);
    if (
      typeCode.length === 0 ||
      availableTypes.includes(
        (typeCode as string).toUpperCase() as FundsTypeEnum,
      )
    ) {
      return null;
    }
    return Util.returnFieldError(FUTYErrorMsgEnum.VALIDATE, 'Fund Typecode');
  }
}
