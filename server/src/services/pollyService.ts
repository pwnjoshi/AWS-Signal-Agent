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
 * Synthesizes human-like natural conversation speech for Dori using Amazon Polly Neural/Generative voices.
 */
export async function synthesizeDoriSpeech(
  text: string, 
  voiceId: VoiceId = 'Ruth', 
  engine: Engine = 'generative'
): Promise<PollySynthesisResult | null> {
  try {
    // Amazon Polly Generative supports conversational tone and human-like inflection
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voiceId, // Ruth, Danielle, Joanna, Matthew, Amy
      Engine: engine, // 'generative' or 'neural'
      TextType: 'text',
    });

    const response = await pollyClient.send(command);
    if (!response.AudioStream) {
      throw new Error('No AudioStream received from Amazon Polly');
    }

    // Convert AudioStream to Buffer and then Base64
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
    
    // Fallback to Neural Joanna if Generative is unavailable in the region
    if (engine === 'generative') {
      try {
        return await synthesizeDoriSpeech(text, 'Joanna', 'neural');
      } catch (fallbackErr: any) {
        console.warn('Polly Neural fallback failed:', fallbackErr.message);
      }
    }
    return null;
  }
}
