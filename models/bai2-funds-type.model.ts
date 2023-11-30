import { FundsTypeEnum } from '../enums';
import { IDistribution } from './bai2-funds-distribution.model';

export interface IBAI2_FUNDS_TYPE {
  typeCode: FundsTypeEnum;
  immediateAmount?: number;
  oneDayAmount?: number;
  twoDayAmount?: number;
  date?: string;
  time?: string;
  distributionNumber?: number;
  distributions?: IDistribution[];
}
