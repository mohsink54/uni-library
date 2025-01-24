import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import emailjs from '@emailjs/browser';
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
})


const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
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
      // Use EmailJS to send the email
      const emailJSConfig = {
        serviceId: config.env.sendemail.emailService,
        templateId: config.env.sendemail.emailTemplate,
        userId: config.env.sendemail.emailPublic
      };
  
      const templateParams = {
        to_email: email,
        subject,
        message,
        from_name: "BookWorms",
      };
  
      // Send email using EmailJS
      await emailjs.send(
        emailJSConfig.serviceId,
        emailJSConfig.templateId,
        templateParams,
        emailJSConfig.userId
      );
  
      console.log(`Email successfully sent to ${email}`);
    } catch (error) {
      console.error("Failed to send email using EmailJS:", error);
      throw error; // Optional: Rethrow error to handle it in workflows
    }
  };