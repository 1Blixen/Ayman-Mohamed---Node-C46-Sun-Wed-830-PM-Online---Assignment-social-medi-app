import { number } from "zod"

export const generateHTML = (otp : string | number)=>{
    
    
    const digits = otp.toString().split('')
    
    
    const htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
 
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
 
                <!-- Card -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
 
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #4f46e5; padding: 40px 40px 30px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                SarahaApp
                            </h1>
                            <p style="margin: 8px 0 0; color: #c7d2fe; font-size: 14px;">
                                Anonymous Messaging Platform
                            </p>
                        </td>
                    </tr>
 
                    <!-- Icon -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 0;">
                            <div style="width: 72px; height: 72px; background-color: #eef2ff; border-radius: 50%; display: inline-block; line-height: 72px; text-align: center;">
                                <span style="font-size: 36px;">🔐</span>
                            </div>
                        </td>
                    </tr>
 
                    <!-- Body -->
                    <tr>
                        <td align="center" style="padding: 30px 48px 0;">
                            <h2 style="margin: 0 0 12px; color: #1e1b4b; font-size: 22px;">
                                Verify Your Email Address
                            </h2>
                            <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                                Use the OTP below to confirm your email address. 
                                This code will expire in <strong>10 minutes</strong>.
                            </p>
                        </td>
                    </tr>
 
                    <!-- OTP Box -->
                    <tr>
                        <td align="center" style="padding: 36px 48px;">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <!-- Each digit in its own cell -->
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle; margin: 0 6px;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 0;">${digits[0]}</span>
                                    </td>
                                    <td style="width: 8px;"></td>
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5;">${digits[1]}</span>
                                    </td>
                                    <td style="width: 8px;"></td>
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5;">${digits[2]}</span>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5;">${digits[3]}</span>
                                    </td>
                                    <td style="width: 8px;"></td>
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5;">${digits[4]}</span>
                                    </td>
                                    <td style="width: 8px;"></td>
                                    <td style="width: 56px; height: 64px; background-color: #eef2ff; border: 2px solid #4f46e5; border-radius: 10px; text-align: center; vertical-align: middle;">
                                        <span style="font-size: 32px; font-weight: 700; color: #4f46e5;">${digits[5]}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
 
                    <!-- Timer note -->
                    <tr>
                        <td align="center" style="padding: 0 48px 36px;">
                            <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                                ⏱ This OTP expires in <strong style="color: #4f46e5;">10 minutes</strong>
                            </p>
                        </td>
                    </tr>
 
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 48px;">
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
                        </td>
                    </tr>
 
                    <!-- Warning -->
                    <tr>
                        <td align="center" style="padding: 24px 48px;">
                            <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                                If you didn't request this code, you can safely ignore this email.
                                Someone may have entered your email address by mistake.
                            </p>
                        </td>
                    </tr>
 
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f9fafb; padding: 24px 48px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © 2026 SarahaApp · All rights reserved
                            </p>
                            <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                                This is an automated message, please do not reply.
                            </p>
                        </td>
                    </tr>
 
                </table>
 
            </td>
        </tr>
    </table>
 
</body>
</html>`

return htmlTemplate
}