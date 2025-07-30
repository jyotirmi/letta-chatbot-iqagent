import { lettaCloud } from '@letta-ai/vercel-ai-sdk-provider';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Array<{ role: string; content: string }> } = await req.json();

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 });
    }

    // Get agent ID from environment
    const agentId = process.env.LETTA_AGENT_ID;
    if (!agentId) {
      return new Response('Agent not configured. Please run: npm run setup-agent', { 
        status: 500 
      });
    }

    // Stream response from Letta agent
    // IMPORTANT: Only pass the new message, NOT conversation history
    // Letta agents are stateful and maintain their own conversation history
    const result = streamText({
      model: lettaCloud(agentId),
      prompt: lastMessage.content,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      // Handle specific Letta errors
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        return new Response('Invalid API key. Please check your LETTA_API_KEY', { 
          status: 401 
        });
      }
      
      if (error.message.includes('404') || error.message.includes('not found')) {
        return new Response('Agent not found. Please run: npm run setup-agent', { 
          status: 404 
        });
      }
    }

    return new Response('Internal server error', { status: 500 });
  }
} 