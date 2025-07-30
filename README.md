# Letta Chat Assistant

A Next.js chat application powered by [Letta](https://docs.letta.com/), demonstrating stateful AI agents with persistent memory.

## ✨ Features

- **Stateful AI Agent**: Remembers conversations across sessions
- **Real-time Streaming**: Live response streaming using Vercel AI SDK
- **Persistent Memory**: Agent maintains context and learns over time
- **Built-in Tools**: Web search and code execution capabilities
- **Modern UI**: Beautiful, responsive chat interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A [Letta Cloud](https://app.letta.com) account (free tier available)

### 1. Get Your Letta API Key

1. Sign up at [https://app.letta.com](https://app.letta.com)
2. Navigate to [API Keys](https://app.letta.com/api-keys)
3. Create a new API key and copy it

### 2. Setup the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Edit .env.local and add your API key:
# LETTA_API_KEY=your_api_key_here
```

### 3. Create Your Agent

```bash
# This will create a new Letta agent and save its ID
npm run setup-agent
```

### 4. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting!

## 🏗️ Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Chat API endpoint (Vercel AI SDK)
│   ├── globals.css          # Global styles with Tailwind CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   └── Chat.tsx             # Chat interface component
├── scripts/
│   └── setup-agent.ts       # Agent creation script
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🔧 Key Technologies

- **[Letta](https://docs.letta.com/)**: Stateful AI agent platform
- **[Next.js 15](https://nextjs.org/)**: React framework
- **[Vercel AI SDK](https://sdk.vercel.ai/)**: Streaming AI responses
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework

## 💡 How It Works

### Stateful Agents vs Traditional Chatbots

Unlike traditional chatbots that are stateless, Letta agents:

- **Remember conversations** across sessions
- **Learn and adapt** from interactions
- **Maintain context** automatically
- **Execute tools** server-side for enhanced capabilities

### The Chat Flow

1. **User sends message** → Next.js API route
2. **API route** → Letta agent via Vercel AI SDK
3. **Agent processes** message with full conversation history
4. **Agent responds** with streaming data
5. **UI updates** in real-time

### Memory Blocks

Your agent is configured with three memory blocks:

- **`human`**: Stores information about you
- **`persona`**: Defines the agent's personality  
- **`project_context`**: Remembers this demo project

## 🛠️ Customization

### Modify Agent Behavior

Edit `scripts/setup-agent.ts` to customize:

- **Memory blocks**: Change personality, context, or add new blocks
- **Tools**: Add/remove built-in tools (`web_search`, `run_code`)
- **Model**: Switch between different AI models

### Change the UI

Edit `components/Chat.tsx` to:

- Customize the chat interface
- Add message types (tool calls, reasoning)
- Modify styling and layout

### Add Custom Tools

```typescript
// For custom tools, use the full Node.js SDK
import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient({ token: process.env.LETTA_API_KEY });

// Create custom tool (Python SDK has more features for this)
// See: https://docs.letta.com/tools/custom-tools
```

## 📖 Learn More

- **[Letta Documentation](https://docs.letta.com/)** - Complete guide to Letta
- **[Letta GitHub](https://github.com/letta-ai/letta)** - Open source repository  
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI integration toolkit
- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about Next.js

## 🐛 Troubleshooting

### Agent Setup Issues

```bash
# If setup-agent fails, check your API key
echo $LETTA_API_KEY

# Recreate agent if needed
npm run setup-agent
```

### Chat Not Working

1. **Check `.env.local`** - Ensure `LETTA_API_KEY` and `LETTA_AGENT_ID` are set
2. **Verify API key** - Test at [app.letta.com](https://app.letta.com)
3. **Check console** - Look for errors in browser dev tools

### Development Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LETTA_API_KEY` | Your Letta Cloud API key | ✅ |
| `LETTA_AGENT_ID` | Agent ID (set by setup script) | ✅ |
| `LETTA_BASE_URL` | Custom Letta server URL | ❌ |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Letta](https://docs.letta.com/) and [Next.js](https://nextjs.org/) 