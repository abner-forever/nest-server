import nodeMailer from 'nodemailer';

interface EmailOptions {
  service: string;
  fromUser: string;
  subject: any;
  secureConnection: boolean;
  // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
  auth: {
    user: string; //这里是发送人的邮箱，就是你刚刚注册的那个邮箱地址
    pass: string;
  };
}
interface SendEmailParams {
  title: string;
  toEmail: string;
  message: string;
}
class Email {
  options: EmailOptions;
  mailer: any;
  constructor() {
    this.options = {
      service: 'qq',
      fromUser: process.env.EMAIL_ADDRESS,
      subject: null,
      secureConnection: true,
      // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
      auth: {
        user: process.env.EMAIL_ADDRESS, //这里是发送人的邮箱，就是你刚刚注册的那个邮箱地址
        pass: process.env.EMAIL_ADDRESS_PASS, //邮箱生成的登录key（刚刚生成的客户端专用密码）
      },
    };
    this.mailer = nodeMailer.createTransport(this.options);
  }

  /**
   * 发送邮件
   */
  sendEmail({ toEmail, title, message }: SendEmailParams) {
    const mailOptions = {
      // 发送邮件的地址
      from: this.options.fromUser, // login user must equal to this user
      // 接收邮件的地址
      to: toEmail,
      // 邮件主题
      subject: title || '你有一条新消息',
      // 以HTML的格式显示，这样可以显示图片、链接、字体颜色等信息
      html: message,
    };
    return this.mailer.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('邮件发送失败', err);
        throw Error(err);
      }
    });
  }
}
export default Email;
