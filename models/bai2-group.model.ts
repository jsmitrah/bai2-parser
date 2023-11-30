import { IBAI2_ACCOUNT } from './bai2-account.model';
import { IBAI2_GROUP_HEADER } from './bai2-group-header.model';
import { IBAI2_GROUP_TRAILER } from './bai2-group-trailer.model';

export interface IBAI2_GROUP extends IBAI2_GROUP_HEADER, IBAI2_GROUP_TRAILER {
  accounts: IBAI2_ACCOUNT[];
}
