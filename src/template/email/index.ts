interface AuthcodeEmailParams {
  code: string;
  date: string;
}
/**
 * 验证码邮件模板
 */
export const authcodeEmail = (params: AuthcodeEmailParams) => {
  return `<div style="max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 5px; background: linear-gradient(to right, #46de97, #03e4d5); box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
  <h3 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Hi, 亲爱的用户：</h3>
  <p style="margin-bottom: 20px; line-height: 1.6;">
    感谢您选择我们的服务！<br>
    您正在进行邮箱验证，本次请求的验证码为：<strong style="color: #f60; letter-spacing: 3px;">${params.code}</strong>。<br>
    为了保障您帐号的安全性，请在10分钟内完成验证。<br>
    祝您生活愉快！
  </p>
  <p style="margin-bottom: 20px; line-height: 1.6;">
    <strong style="color: #333333;">快速访问：</strong><br>
    <a href="https://foreverheart.top" style="color: #007bff; text-decoration: none;" target="_blank" rel="noopener noreferrer">https://foreverheart.top</a>
  </p>
  <p style="text-align: right; color: #666666;">${params.date}</p>
</div>
`;
};

/**
 * 锻炼邮件模板
 */
export const exerciseEmail = ({ questionUrl, today, workouts }) => {
  return `<div class="container" style="background: #00b8a9; border-radius: 8px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); padding: 20px; max-width: 500px; margin: 20px auto;">
  <div class="header" style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #f9f7f7; margin: 0; font-size: 24px;">Hi！今天运动了吗？</h1>
  </div>
  <div class="desc" style="font-size: 18px; color: #f9f7f7; margin-bottom: 20px;">
    <p>快来和我一起保持健康的生活习惯！</p>
  </div>
  <div class="content" style="font-size: 16px; color: #f9f7f7; margin-bottom: 20px;">
    <p>今日锻炼推荐：</p>
    <ul>
      ${workouts}
    </ul>
  </div>
  <div class="action" style="text-align: center; margin-top: 30px;">
    <p><a href=${questionUrl} style="color: #ffffff; text-decoration: none; background-color: #f6416c; padding: 10px 20px; border-radius: 25px;">立即打卡</a></p>
  </div>
  <div class="date" style="font-size: 14px; color: #ffffff; text-align: right; margin-top: 20px;">${today}</div>
</div>`;
};

export const todoEmail = ({ title, description, endTime, username }) => {
  return `
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333333;">[待办提醒] 完成报告撰写任务</h1>
    <p style="color: #666666; line-height: 1.6;">亲爱的[${username}]，</p>
    <p style="color: #666666; line-height: 1.6;">您有一个待办事项需要及时处理，请查看详情并尽快完成：</p>
    <ul style="color: #666666; line-height: 1.6;">
      <li><strong>标题：</strong> ${title}</li>
      <li><strong>描述：</strong> ${description}</li>
      <li><strong>截止日期：</strong> ${endTime}</li>
    </ul>
    <p style="color: #666666; line-height: 1.6;">请点击下面的按钮查看详情并完成待办事项：</p>
    <a href="http://foreverheart.top/todo" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">查看待办事项</a>
    <p style="color: #666666; line-height: 1.6;">[${username}]</p>
  </div>
</body>`;
};
