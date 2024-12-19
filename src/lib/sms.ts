import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async ({
  to,
  message
}: {
  to: string;
  message: string;
}) => {
  try {
    const result = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error };
  }
}; 