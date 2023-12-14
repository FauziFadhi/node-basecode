export enum EnumUploadType {
  COMMON = 'common',
}

export interface IBaseUploadRsp {
  type: EnumUploadType;
  fileName: string;
  url: string;
}
