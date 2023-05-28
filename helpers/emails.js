import nodemailer from 'nodemailer';

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const {email,name,token} = data;
    // Send mail
    await transport.sendMail({
        from: 'Nestate.com',
        to: email,
        subject: 'Activate Your Nestate Account',
        text: 'Activate Your Nestate Account',
        html: `
            <p>Hello dear ${name}, we are happy to have you here with us! <br>
            We were waiting for you. <br> The last step to our space would only be to confirm your account, and you would already be inside!</p>
            <p><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirm/${token}">Confirm Account</a></p>

            <p>If you have not created this account, you can ignore this message.</p>
        `
    })
}

const passwordResetEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const {email,name,token} = data;
    // Send mail
    await transport.sendMail({
        from: 'Nestate.com',
        to: email,
        subject: 'Reset your Nestate password',
        text: 'Reset your Nestate password',
        html: `
            <p>Hi ${name},<br> We're sending you this email because you requested a password reset.<br> Click on the link below to create a new password</p>
            <p><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/forgot-password/${token}">Reset Password</a></p>

            <p>If you didn't request a password reset, you can ignore this email. Your password will no be changed.</p>
        `
    })
}




export {registerEmail, passwordResetEmail};