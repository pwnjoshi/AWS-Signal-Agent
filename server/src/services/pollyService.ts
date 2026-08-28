import { PollyClient, SynthesizeSpeechCommand, VoiceId, Engine } from '@aws-sdk/client-polly';
import { fromIni } from '@aws-sdk/credential-providers';

const region = process.env.AWS_REGION || 'us-east-1';
const profile = process.env.AWS_PROFILE || 'cloudblueprint';

const pollyClient = new PollyClient({
  region,
  ...(process.env.AWS_LAMBDA_FUNCTION_NAME ? {} : { credentials: fromIni({ profile }) })
});

export interface PollySynthesisResult {
  audioBase64: string;
  format: string;
  voice: string;
  engine: string;
}

/**
 * Clean text for cute conversational speech playback.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_#`~[\]()<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes cute, baby-girl cheerful conversation speech for Dori using Amazon Polly Neural voice (Ivy).
 */
export async function synthesizeDoriSpeech(
  text: string, 
  voiceId: VoiceId = 'Ivy', 
  engine: Engine = 'neural'
): Promise<PollySynthesisResult | null> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return null;

  try {
    const command = new SynthesizeSpeechCommand({
      Text: cleaned,
      OutputFormat: 'mp3',
      VoiceId: voiceId, // 'Ivy' = Cute female child/young girl voice
      Engine: engine, // 'neural'
      TextType: 'text',
    });

    const response = await pollyClient.send(command);
    if (!response.AudioStream) {
      throw new Error('No AudioStream received from Amazon Polly');
    }

    const chunks: Uint8Array[] = [];
    const stream = response.AudioStream as any;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const audioBase64 = `data:audio/mp3;base64,${buffer.toString('base64')}`;

    return {
      audioBase64,
      format: 'mp3',
      voice: voiceId,
      engine,
    };
  } catch (err: any) {
    console.warn('Amazon Polly synthesis error (falling back):', err.message);
    
    // Fallback to Neural Ruth / Joanna if Ivy is unavailable
    try {
      const fallbackCommand = new SynthesizeSpeechCommand({
        Text: cleaned,
        OutputFormat: 'mp3',
        VoiceId: 'Ruth',
        Engine: 'generative',
        TextType: 'text',
      });
      const response = await pollyClient.send(fallbackCommand);
      if (response.AudioStream) {
        const chunks: Uint8Array[] = [];
        const stream = response.AudioStream as any;
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return {
          audioBase64: `data:audio/mp3;base64,${buffer.toString('base64')}`,
          format: 'mp3',
          voice: 'Ruth',
          engine: 'generative',
        };
      }
    } catch {}
    return null;
  }
}
