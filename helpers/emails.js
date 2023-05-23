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
        subject: 'Activate Your Nest Account',
        text: 'Activate Your Nest Account',
        html: `
            <p>Hello dear ${name}, we are happy to have you here with us! <br>
            We were waiting for you. <br> The last step to our space would only be to confirm your account, and you would already be inside!</p>
            <p><a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirm/${token}">Confirm Account</a></p>

            <p>If you have not created this account, you can ignore this message.</p>
        `
    })
}




export {registerEmail}