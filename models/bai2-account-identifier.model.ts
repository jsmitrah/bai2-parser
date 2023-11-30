import { IBAI2_SUMMARY } from './bai2-summary.model';

/* AccountIdentifierCode (03) */
export interface IBAI2_ACCOUNT_IDENTIFIER {
  accountNumber: string;
  currencyCode?: string;
  summaries: IBAI2_SUMMARY[];
}
