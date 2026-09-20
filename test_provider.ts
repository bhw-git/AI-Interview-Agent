import 'dotenv/config';
import { llmClient } from './server/llm/client';

const s = llmClient.getProviderStatus();
console.log('Provider:', s.activeProvider);
console.log('Model:', s.activeModel);
console.log('Bedrock configured:', s.bedrock.configured);
console.log('Bedrock authType:', s.bedrock.authType);
console.log('Bedrock isPreSignedUrl:', s.bedrock.isPreSignedUrl);
console.log('Bedrock modelId:', s.bedrock.modelId);
console.log('Gemini configured:', s.gemini.configured);
console.log('OpenAI configured:', s.openai.configured);