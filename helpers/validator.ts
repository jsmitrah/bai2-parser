import { RecordCodesEnum } from '../enums';

export class Validator {

  private static CURRENCY_CODE_REGEX = /^[a-zA-Z]{3}$/;
  private static DATE_TYPE_REGEX = /[0-9][0-9][0-9][0-9]-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])/;
  private static SIGNED_NUMBER_REGEX = /^(-|\+|)?[0-9]\d*$/;
  private static TIME_TYPE_REGEX = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\.\d{3}$/;
  private static TYPE_CODE_REGEX = /^[0-9]{3}$/;

  public static Date(input: string): boolean {
    return Validator.DATE_TYPE_REGEX.test(input);
  }

  public static Time(input: string): boolean {
    return Validator.TIME_TYPE_REGEX.test(input);
  }

  public static FundsType(input: RecordCodesEnum): boolean {
    if (Object.values(RecordCodesEnum).includes(input)) {
      return true;
    }
    return false;
  }

  public static Amount(input: string): boolean {
    return Validator.SIGNED_NUMBER_REGEX.test(input);
  }

  public static CurrencyCode(input: string): boolean {
    return Validator.CURRENCY_CODE_REGEX.test(input);
  }

  public static TypeCode(input: string): boolean {
    return Validator.TYPE_CODE_REGEX.test(input);
  }
}
