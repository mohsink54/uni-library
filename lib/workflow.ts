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

const transporter = nodemailer.createTransport({
  host: config.env.sendEmail.host,
  port: 587,
  secure: false,
  auth: {
    user: config.env.sendEmail.user,
    pass: config.env.sendEmail.password,
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
    await qstashClient.publishJSON({
      url: `${config.env.prodApiEndpoint}/api/workflows/send-email`,
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
      to: email, 
      subject, 
      html: message, 
    });

    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw error;
  }
};