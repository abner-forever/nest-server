interface AuthcodeEmailParams {
  code: string;
  sign: string;
  date: string;
}
/**
 * 验证码邮件模板
 */
export const authcodeEmail = (params: AuthcodeEmailParams) => {
  return `
<div class="biu-nav-email"
  style="max-width: 600px;min-width: 300px;margin: 40px auto;box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);font-size: 16px;padding: 20px;background-image: linear-gradient(to right, #46de97 0%, #03e4d5 100%);border-radius: 5px;color: #fff;">
  <h3 style="margin-bottom: 40px;">
    Hi! 亲爱的用户：
  </h3>
  <p style="padding-left: 20px;">
    您正在进行邮箱验证,本次请求的验证码为:
  </p>
  <p style="color: #dde2e2;padding-left: 14px;">
    <strong style="color: #f60;font-size: 24px;">
     ${params.code}
    </strong>
    <span>(为了保障您帐号的安全性,请在30分钟内完成验证,祝您生活愉快!)</span>
  </p>
  <p style="padding-left: 20px;">
    <span>快速访问:</span>
    <a href="https://foreverheart.top" style="color:#fff" target="_blank" rel="noopener noreferrer">https:
      //foreverheart.top</a>
  </p>
  <p style="margin-top: 40px;text-align: right;">
    ${params.sign}
  </p>
  <p style="text-align: right;">
    ${params.date}
  </p>
</div>
`;
};

/**
 * 锻炼邮件模板
 * TODO:
 */
export const exerciseEmail = ({ questionUrl, today, workouts }) => {
  return `<div class="container" style="background: linear-gradient(135deg, #65d3ff, #7dffa6); border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); padding: 20px; max-width: 500px; margin: 20px auto;">
  <div class="header" style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Hi！今天运动了吗？</h1>
  </div>
  <div class="desc" style="font-size: 18px; color: #ffffff; margin-bottom: 20px;">
    <p>快来和我一起保持健康的生活习惯！</p>
  </div>
  <div class="content" style="font-size: 16px; color: #ffffff; margin-bottom: 20px;">
    <p>今天的锻炼推荐：</p>
    <ul>
      ${workouts}
    </ul>
  </div>
  <div class="action" style="text-align: center; margin-top: 30px;">
    <p><a href=${questionUrl} style="color: #ffffff; text-decoration: none; background-color: #ff847c; padding: 10px 20px; border-radius: 25px;">立即打卡</a></p>
  </div>
  <div class="date" style="font-size: 14px; color: #ffffff; text-align: right; margin-top: 20px;">${today}</div>
</div>`;
};
