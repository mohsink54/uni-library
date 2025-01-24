import { handleEmailWorkflow } from "@/lib/workflow";
import { NextApiRequest, NextApiResponse } from "next";


// This handler will process the email request and trigger the email sending
export default async function sendEmailHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, subject, message } = req.body;

  // Make sure required fields are present
  if (!email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call the handleEmailWorkflow function to send the email
    await handleEmailWorkflow({
      email,
      subject,
      message,
    });

    // Send a success response
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
