import { AsOfDateModifierEnum, GroupStatusEnum } from '../enums';

/* GroupHeaderCode (02) */
export interface IBAI2_GROUP_HEADER {
  receiver?: string;
  originator: string;
  groupStatus: (typeof GroupStatusEnum)[keyof typeof GroupStatusEnum];
  asOfDate: string;
  asOfTime?: string;
  currencyCode?: string;
  asOfDateModifier?: (typeof AsOfDateModifierEnum)[keyof typeof AsOfDateModifierEnum];
}
