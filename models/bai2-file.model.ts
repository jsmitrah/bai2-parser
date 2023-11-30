import { IBAI2_FILE_HEADER } from './bai2-file-header.model';
import { IBAI2_FILE_TRAILER } from './bai2-file-trailer.model';
import { IBAI2_GROUP } from './bai2-group.model';

export interface IBAI2_FILE extends IBAI2_FILE_HEADER, IBAI2_FILE_TRAILER {
  groups: IBAI2_GROUP[];
}
