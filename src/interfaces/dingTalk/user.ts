import { IDingTalkBaseResult } from './base';

export interface ICleanUser {
  current: number;
  next: number;
  users: string[];
}

export interface IUser {
  id: string;
  unionid: string;
  name: string;
  dept_name?: string;
  english_name?: string;
  groupid?: number;
  dept_id_list?: string[];
  phone?: string;
  hired_date: number;
  avatar?: string;
  mobile?: string;
  email?: string;
  work_place?: string;
  remark?: string;
  boss?: boolean;
  role_list?: IDingTalkUserRole[];
  title?: string;
}

export type IDingTalkUserResult = IDingTalkBaseResult<IDingTalkUser>;

export interface IDingTalkUser {
  userid: string;
  name: string;
  unionid: string;
  dept_id_list: string[];
  // 入职时间戳
  hired_date: number;
  avatar: string;
  mobile: string;
  email: string;
  work_place: string;
  remark: string;
  boss: boolean;
  role_list: IDingTalkUserRole[];
  title: string;
}

export type IDingTalkUserListIdResult =
  IDingTalkBaseResult<IDingTalkUserIdList>;

export interface IDingTalkUserIdList {
  userid_list: string[];
}

export interface IUserToken {
  access_token: string;
  sub: string;
  realm_access: {
    roles: string[];
  };
  preferred_username: string;
  name: string;
  expires_at: number;
}

export interface IDingTalkUserRole {
  id: number;
  name: string;
  group_name: string;
}
