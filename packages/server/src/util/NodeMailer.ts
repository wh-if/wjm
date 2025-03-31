import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com", // 主机
  secureConnection: true, // 使用 SSL
  service: "qq",
  port: 465, // SMTP 端口
  auth: {
    user: "test@qq.com", // 账号
    pass: "获取的授权码", // 授权码
  },
});

let mailContent = {
  from: "test@qq.com", // 发件人地址
  to: "test@qq.com", // 收件人地址
  subject: "主题内容", // 主题
  html: `可以是html模式的文本`, // html body
};

// 发送邮件
transporter.sendMail(mailContent, (err, info) => {
  if (err) {
    console.log("发邮件出错了", err);
  } else {
    console.log("邮件发送成功");
  }
});
