export const generateOTPEmailTemplate = (otp, purpose = "verification") => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f9fafb;
        color: #1f2937;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      }
      .header {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #0ea5e9;
        margin-bottom: 10px;
      }
      .otp-box {
        text-align: center;
        margin: 30px 0;
      }
      .otp {
        font-size: 36px;
        font-weight: bold;
        color: #0ea5e9;
        background: #e0f2fe;
        padding: 12px 28px;
        border-radius: 10px;
        display: inline-block;
        letter-spacing: 3px;
      }
      .footer {
        margin-top: 40px;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f172a;
          color: #f1f5f9;
        }
        .container {
          background: #1e293b;
          box-shadow: none;
        }
        .otp {
          background: #334155;
          color: #38bdf8;
        }
        .footer {
          color: #94a3b8;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">CodeMate - OTP ${purpose}</div>
      <p>Hi,</p>
      <p>Please use the following One-Time Password (OTP) to complete your ${purpose} process:</p>
      <div class="otp-box">
        <div class="otp">${otp}</div>
      </div>
      <p>This OTP is valid for only <strong>5 minutes</strong>. Please do not share this code with anyone for security reasons.</p>
      <p>If you did not initiate this request, you can safely ignore this email.</p>
      <div class="footer">
        © ${new Date().getFullYear()} CodeMate. All rights reserved.<br/>
        This is an automated email. Please do not reply.
      </div>
    </div>
  </body>
  </html>
  `;
};
