require("dotenv").config();
const { sendSMS } = require("../utils/providers/twilio");

async function sendSmsMock(phone, message) {

  console.log("Sending MOCK SMS →", phone, message);
  return true;
};

async function sendTwilioSms(phone, message) {
try {
    // Ensure number formatting if needed
    const formattedPhone = phone.startsWith('+') ? phone : `+27${phone}`;

    const result = await sendSMS(formattedPhone, message);

    return {
      success: true,
      sid: result.sid
    };
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    throw error;
  }
};

module.exports = async function triggerSendSms(phone, message) {
  const useMock = process.env.SMS_USE_MOCK === 'true';
  const provider = process.env.SMS_PROVIDER || 'twilio';

  if (useMock) {
    return sendSmsMock(phone, message);
  }

  switch (provider) {
    case 'twilio':
      return sendTwilioSms(phone, message);
    default:
      throw new Error(`Unsupported SMS provider: ${provider}`);
  }
};