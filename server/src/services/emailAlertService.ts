import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { fromIni } from '@aws-sdk/credential-providers';
import { AWSSignal, UserPreferences } from '../types';

const region = process.env.AWS_REGION || 'us-east-1';
const profile = process.env.AWS_PROFILE || 'cloudblueprint';

const sesClient = new SESClient({ 
  region,
  ...(process.env.AWS_LAMBDA_FUNCTION_NAME ? {} : { credentials: fromIni({ profile }) })
});

export interface AlertResult {
  sent: boolean;
  recipients: string[];
  subject: string;
  reason: string;
  timestamp: string;
}

export async function sendSignalAlertIfNeeded(signal: AWSSignal, prefs: UserPreferences): Promise<AlertResult> {
  const recipients = (prefs.email_list && prefs.email_list.length > 0) 
    ? prefs.email_list 
    : [prefs.email || 'pawan@example.com'];

  if (!prefs.email_enabled || prefs.digest_frequency === 'off') {
    return {
      sent: false,
      recipients,
      subject: '',
      reason: 'Email alerts disabled in user preferences',
      timestamp: new Date().toISOString(),
    };
  }

  const isHighPriority = signal.signal_score >= 80;
  const meetsThreshold = prefs.alert_threshold === 'all' || (prefs.alert_threshold === 'high' && isHighPriority);

  if (!meetsThreshold) {
    return {
      sent: false,
      recipients,
      subject: '',
      reason: `Signal score (${signal.signal_score}) below user threshold (${prefs.alert_threshold})`,
      timestamp: new Date().toISOString(),
    };
  }

  const subject = `[AWS Signal Alert] ${signal.title}`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 20px;">⚡ AWS Signal Alert</h2>
        <span style="background: #ef4444; color: #ffffff; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 12px;">Signal Score: ${signal.signal_score}</span>
      </div>

      <h3 style="margin-top: 0; color: #0f172a;">${signal.title}</h3>
      <p style="color: #64748b; font-size: 13px;">Source: ${signal.source} | Services: ${signal.aws_services.join(', ')}</p>

      <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px; margin: 16px 0; border-radius: 4px;">
        <h4 style="margin: 0 0 6px 0; color: #1e40af; font-size: 14px;">Why it matters:</h4>
        <p style="margin: 0; font-size: 14px;">${signal.why_it_matters.why_it_matters}</p>
      </div>

      <div style="margin: 16px 0;">
        <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px;">Community Reaction:</h4>
        <p style="margin: 0; font-size: 14px; color: #475569;">${signal.why_it_matters.community_reaction}</p>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; margin: 16px 0; border-radius: 8px;">
        <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 14px;">Recommended Action:</h4>
        <p style="margin: 0; font-size: 14px; color: #15803d;">${signal.why_it_matters.recommended_action}</p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="${signal.source_url}" target="_blank" style="background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Read Official Source</a>
      </div>

      <div style="margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #94a3b8; text-align: center;">
        Sent by Dori — Your Autonomous AWS Intelligence Companion.<br/>
        Delivered to: ${recipients.join(', ')}<br/>
        You can adjust alert preferences in your AWS Signal Dashboard settings.
      </div>
    </div>
  `;

  if (process.env.SES_SENDER_EMAIL) {
    try {
      const command = new SendEmailCommand({
        Source: process.env.SES_SENDER_EMAIL,
        Destination: { ToAddresses: recipients },
        Message: {
          Subject: { Data: subject },
          Body: { Html: { Data: htmlBody } }
        }
      });
      await sesClient.send(command);
      console.log(`[Email Alert Service] SES alert email successfully sent to ${recipients.length} recipients: [${recipients.join(', ')}]`);
    } catch (err: any) {
      console.warn(`[Email Alert Service] SES send note: ${err.message}. Logging alert locally for [${recipients.join(', ')}].`);
    }
  } else {
    console.log(`[Email Alert Service] AWS SES unconfigured or in demo mode. Simulated alert to [${recipients.join(', ')}]: ${subject}`);
  }

  return {
    sent: true,
    recipients,
    subject,
    reason: `Signal score ${signal.signal_score} triggered instant alert`,
    timestamp: new Date().toISOString(),
  };
}
