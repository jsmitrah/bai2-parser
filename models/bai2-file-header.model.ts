/* FileHeaderCode (01) */
export interface IBAI2_FILE_HEADER {
  sender: string;
  receiver: string;
  fileCreatedDate: string;
  fileCreatedTime: string;
  fileIdNumber: string;
  physicalRecordLength?: number;
  blockSize?: number;
  versionNumber: number;
}
