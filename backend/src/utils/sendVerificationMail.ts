import createMailTransporter from "../utils/createMailTransporter";
import { IUser } from "../model/User"; // Import der IUser-Schnittstelle

const sendVerificationEmail = (user: IUser) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"BookAhead" <esradorak@gmail.com>',
    to: user.email,
    subject: 'Please verify your email address',
    html: `<p>Hello ${user.name}, verify your email by clicking this link...</p>
    <a href = 'http://localhost:3000/verify-email/${user.emailToken}'>Verify Your
    Email</a>
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification email sent");
    }
  });
};

export default sendVerificationEmail;
