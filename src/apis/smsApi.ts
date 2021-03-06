import * as Core from '@alicloud/pop-core';
import config from '@config/config';

const SMSApi = {
  sendNotCommitReportSMS: async (
    user: { name: string; phone: string },
    endTime: string,
  ) => {
    if (!user.phone) return;
    const { accessKeyId, accessKeySecret, endpoint, apiVersion } =
      config.aliSms;
    const { code, signName } = config.smsTemplate;
    const client = new Core({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      endpoint: endpoint,
      apiVersion: apiVersion,
    });

    const params = {
      SignName: signName,
      TemplateCode: code,
      PhoneNumbers: user.phone,
      TemplateParam: `{\"name\":\"${user.name}\", \"date\": \"${endTime}\"}`,
    };

    const requestOption = {
      method: 'POST',
    };

    client.request('SendSms', params, requestOption).then(
      () => {
        console.log(`${user.name} SMS send successed!`);
      },
      (ex) => {
        console.log(ex);
        console.log(`${user.name} SMS send failed!`);
      },
    );
  },
};
export default SMSApi;
