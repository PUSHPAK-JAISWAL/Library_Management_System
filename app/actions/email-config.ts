"use server"

export async function sendEmailViaResend(
  to: string,
  subject: string,
  message: string,
  type: "issue" | "reminder" | "due" | "return" | "booking" | "reissue",
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        message,
        type,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send email",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("[EMAIL CONFIG ERROR]", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
