export enum FundsTypeEnum {
  IMMEDIATE_AVAILABILITY = '0',
  ONE_DAY_AVAILABILITY = '1',
  TWO_OR_MORE_DAYS_AVAILABILITY = '2',
  DISTRIBUTED_AVAILABILITY_THREE = 'S',
  VALUE_DATED = 'V',
  DISTRIBUTED_AVAILABILITY = 'D',
  UNKNOWN = 'Z',
}

export enum FUTYErrorMsgEnum {
  PARSE = 'FundsType :: Unable to parse',
  VALIDATE = 'FundsType :: Invalid',
}
