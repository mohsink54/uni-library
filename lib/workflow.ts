import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import nodemailer from "nodemailer";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
})


const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: config.env.sendEmail.host, // e.g., smtp.gmail.com
  port: 587, // or 465 for secure connections
  secure: false, // true for port 465
  auth: {
    user: config.env.sendEmail.user, // Email username
    pass: config.env.sendEmail.password, // Email password or app-specific password
  },
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    // Use QStash to trigger the workflow
    await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
      body: { email, subject, message },
    });

    console.log(`Workflow to send email triggered for ${email}`);
  } catch (error) {
    console.error("Failed to trigger QStash workflow:", error);
    throw error;
  }
};

// Workflow handler to send the actual email
export const handleEmailWorkflow = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    console.log("Attempting to send email:", { email, subject, message });
    await transporter.sendMail({
      from: `BookWorms <${config.env.sendEmail.user}>`, // Sender's address
      to: email, // Receiver's email
      subject, // Subject line
      html: message, // HTML body
    });

    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw error;
  }
};