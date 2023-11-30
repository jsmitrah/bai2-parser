import { IBAI2_FUNDS_TYPE } from './bai2-funds-type.model';

export interface IBAI2_SUMMARY {
  typeCode?: string;
  amount?: string;
  itemCount?: number;
  fundsType?: IBAI2_FUNDS_TYPE;
}
