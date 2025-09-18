
const  { transporter } = require('../utils/smpt');

 const sendEmail = async (to, subject, text, html) => {

    console.log(to, subject, text, html)
  try {
    const mailOptions = {
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("error.message " + error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };