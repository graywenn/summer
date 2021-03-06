import { AttendanceState } from '@constants/dingTalk';
import FileData from '@core/files.data';
import { IAttendances, IUserAttendances } from '@interfaces/dingTalk';
import { ITimeSheet } from '@interfaces/timesheet';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { intersect } from '@utils/utils';
import KcClient from '@utils/kcClient';

@Injectable()
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getTodayTimeSheet(username: string) {
    const data = await this.redis.get('timesheets');
    const timesheet = <ITimeSheet[]>JSON.parse(data || '[]');
    const users = await FileData.readUsers();
    const user = users.find((x) => x.name === username);
    const todayTimeSheet = timesheet.find(
      (x) => x.userid === user?.id && x.value,
    );
    return todayTimeSheet;
  }

  async getUserAttendanceSummay(username: string) {
    const date = moment().format('YYYY-MM');
    const dingdingAttendances = await FileData.readAttendances(date);
    const customAttendances = await FileData.readCustomAttendances(date);
    const holidays = await FileData.readHolidays(moment().year().toString());
    const attendances = dingdingAttendances.map(
      (ul: IUserAttendances, index: number) => {
        customAttendances[index].attendances.forEach((x: IAttendances[], i) => {
          if (x !== null) {
            ul.attendances[i] = x;
          }
        });
        return ul;
      },
    );
    const userAttendance = attendances.find((x) => x.name === username);
    const attendanceLog = {
      late: 0,
      notCommitReportCount: 0,
      tomorrowIsHoliday:
        holidays.find(
          (x) => x === moment().add(1, 'days').format('YYYY-MM-DD'),
        ) != null,
    };
    userAttendance.attendances.map((_attendance) => {
      _attendance.map((x) => {
        if (x.state == AttendanceState.L) {
          attendanceLog.late += x.value;
        } else if (x.state == AttendanceState.X) {
          attendanceLog.notCommitReportCount += 1;
        }
      });
    });
    return attendanceLog;
  }

  async getDingTalkUserInfoByName(username: string) {
    const users = await FileData.readUsers();
    return users.find((x) => x.name === username);
  }

  async getUserMember(departmentIds: string[]) {
    const users = await KcClient.kcAdminClient.users.find();
    return users.filter((x) => {
      const ids = x.attributes['departmentids'];
      return intersect(departmentIds, ids).length > 0;
    });
  }

  async getUsers(departmentids?: string[]) {
    let users = await KcClient.kcAdminClient.users.find();
    if (departmentids) {
      users = users.filter(
        (x) =>
          intersect(departmentids, x.attributes['departmentids']).length > 0,
      );
    }
    return users;
  }

  async updateUserResource(userid: string, resourceIds: string) {
    const user = await KcClient.kcAdminClient.users.findOne({ id: userid });
    user.attributes['resourceIds'] = resourceIds;
    await KcClient.kcAdminClient.users.update({ id: userid }, user);
    return user;
  }
}
