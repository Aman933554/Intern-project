const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'amansharma846706@gmail.com',
    pass: 'fsqtvqfgplxljknx',
  },
});

async function send() {
  console.log('Sending live test email to amansharma846706@gmail.com...');
  const info = await transporter.sendMail({
    from: '"OneAtlas.dev Security" <amansharma846706@gmail.com>',
    to: 'amansharma846706@gmail.com',
    subject: '🔐 Security Alert: Live Email Delivery Active on OneAtlas.dev',
    html: `
      <div style="font-family: sans-serif; background-color: #080B12; color: #FFFFFF; padding: 32px; border-radius: 12px;">
        <h2 style="color: #3B82F6;">OneAtlas.dev - Email Notification Verified! 🎉</h2>
        <p>Hello Aman,</p>
        <p>This is a live confirmation email verifying that your Gmail SMTP credentials are active and functioning!</p>
        <div style="background-color: #111827; padding: 16px; border-radius: 8px; border: 1px solid #1F2937;">
          <p style="margin: 0;"><strong>Delivered To:</strong> amansharma846706@gmail.com</p>
          <p style="margin: 8px 0 0;"><strong>Status:</strong> Active & Live in Inbox</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #9CA3AF;">© OneAtlas.dev • AI Model Discovery & Intelligence</p>
      </div>
    `,
  });
  console.log('LIVE EMAIL DELIVERED! Message ID:', info.messageId);
}

send().catch(err => {
  console.error('Error sending email:', err);
  process.exit(1);
});
