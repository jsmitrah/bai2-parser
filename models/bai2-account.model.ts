import { IBAI2_ACCOUNT_IDENTIFIER } from './bai2-account-identifier.model';
import { IBAI2_ACCOUNT_TRAILER } from './bai2-account-trailer.model';
import { IBAI2_TRANSACTION_DETAIL } from './bai2-transaction-detail.model';

export interface IBAI2_ACCOUNT extends IBAI2_ACCOUNT_IDENTIFIER, IBAI2_ACCOUNT_TRAILER {
  details: IBAI2_TRANSACTION_DETAIL[];
}
