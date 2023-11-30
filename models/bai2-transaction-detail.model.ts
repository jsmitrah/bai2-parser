import { IBAI2_CONTINUATION_RECORD } from './bai2-continuation-record.model';
import { IBAI2_FUNDS_TYPE } from './bai2-funds-type.model';

/* TransactionDetailCode (16) */
export interface IBAI2_TRANSACTION_DETAIL extends IBAI2_CONTINUATION_RECORD {
  typeCode: string;
  amount?: string;
  fundsTypeSize?: IBAI2_FUNDS_TYPE;
  bankReferenceNumber?: string;
  customerReferenceNumber?: string;
  text?: string;
}
