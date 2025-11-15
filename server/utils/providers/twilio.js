const twilio = require('twilio');
require("dotenv").config();

// Load credentials from environment variables for security
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

console.log("Twilio ENV LOADED:", {
  accountSid: accountSid ? "OK" : "MISSING",
  authToken: authToken ? "OK" : "MISSING",
  twilioPhoneNumber: twilioPhoneNumber || "MISSING"
});

// Initialize the Twilio client
const client = twilio(accountSid, authToken);

/**
 * Function to send an SMS.
 * @param {string} to - The recipient's phone number (in E.164 format, e.g., "+12345550100")
 * @param {string} body - The text message to send.
 */
async function sendSMS(to, body) {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to
    });
    console.log(`SMS sent successfully! Message SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

// Example of how to call the function
// sendSMS('+12345550100', 'Hello from InsuranceProCRM!');

// This allows the function to be used by other parts of your application
module.exports = { sendSMS };