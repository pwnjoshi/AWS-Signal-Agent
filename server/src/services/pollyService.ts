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
 * Clean text for human-like conversational speech playback.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_#`~[\]()<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synthesizes expressive, human-like, warm conversation speech for Dori using Amazon Polly Generative voice.
 */
export async function synthesizeDoriSpeech(
  text: string, 
  voiceId: VoiceId = 'Danielle', 
  engine: Engine = 'generative'
): Promise<PollySynthesisResult | null> {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return null;

  try {
    const command = new SynthesizeSpeechCommand({
      Text: cleaned,
      OutputFormat: 'mp3',
      VoiceId: voiceId, // Danielle (warm, young, cheerful, expressive)
      Engine: engine, // 'generative'
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
    console.warn('Amazon Polly synthesis error (falling back to neural/local):', err.message);
    
    // Fallback to Neural Joanna / Ruth if Generative is unavailable in the region
    if (engine === 'generative') {
      try {
        return await synthesizeDoriSpeech(cleaned, 'Ruth', 'generative');
      } catch (fallbackErr: any) {
        console.warn('Polly fallback failed:', fallbackErr.message);
      }
    }
    return null;
  }
}
