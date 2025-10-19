import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { to, subject, message, type } = await request.json()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Library Management System</h2>
        </div>
        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb;">
          <p style="color: #374151; line-height: 1.6;">${message}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This is an automated email from Library Management System. Please do not reply to this email.
          </p>
        </div>
      </div>
    `

    const mailOptions = {
      from: process.env.GMAIL_SENDER_EMAIL,
      to: to,
      subject: subject,
      html: htmlMessage,
    }

    await transporter.sendMail(mailOptions)

    console.log(`[EMAIL SENT] To: ${to}, Subject: ${subject}, Type: ${type}`)

    return Response.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("[EMAIL ERROR]", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    )
  }
}
