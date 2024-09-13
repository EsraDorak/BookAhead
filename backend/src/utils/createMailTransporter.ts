import nodemailer from "nodemailer";

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.PASSWORD_USER,
        },
    });
    return transporter;
}
export default createMailTransporter;