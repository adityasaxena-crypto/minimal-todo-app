# AI Features Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
The Mistral AI API key is already configured in `.env` file. If you need to change it:

1. Open `.env` file
2. Update the `VITE_MISTRAL_API_KEY` value
3. Restart the development server

### 3. Start Development Server
```bash
npm run dev
```

## Testing AI Features

### 1. Natural Language Task Creation
- Click "+ Add Task"
- In the "Natural Language Input" field, type:
  - "Create a high priority bug fix for login authentication with security and backend tags"
  - "Add medium priority feature to implement dark mode"
- Click "Parse with AI"
- The form will auto-fill with extracted information

### 2. Task Enhancement
- Create or edit a task
- Fill in at least the title
- Click "Enhance with AI" button
- Review AI suggestions:
  - Improved descriptions
  - Recommended tags
  - Priority suggestions
  - Time estimates
- Click on any suggestion to apply it

### 3. AI Productivity Insights
- Create several tasks across different columns
- Click "AI Insights" button in the header
- View two tabs:
  - **Productivity Insights**: Completion rates, bottlenecks, patterns
  - **Priority Recommendations**: AI-suggested priority changes

### 4. Quick Task Enhancement
- Hover over any task card
- Click the sparkle (✨) icon
- AI will analyze and suggest improvements

## Troubleshooting

### AI Features Not Working?

1. **Check API Key**
   - Open browser console (F12)
   - Look for error messages
   - Verify API key in `.env` file

2. **CORS Issues**
   - Mistral AI API should work from browser
   - If you see CORS errors, the API might be blocking requests
   - Check browser console for details

3. **Rate Limiting**
   - Free tier has rate limits
   - Wait a few seconds between requests
   - Check Mistral AI dashboard for usage

4. **Network Issues**
   - Check internet connection
   - Verify firewall isn't blocking requests
   - Try disabling VPN if active

### Common Error Messages

**"Mistral API key is not configured"**
- Solution: Add your API key to `.env` file

**"Mistral API error: 401"**
- Solution: Invalid API key, check and update in `.env`

**"Mistral API error: 429"**
- Solution: Rate limit exceeded, wait and try again

**"AI enhancement returned no suggestions"**
- Solution: Try with more detailed task information

## API Key Security

⚠️ **Important**: Never commit `.env` file to git!

- `.env` is in `.gitignore` by default
- Use `.env.example` as a template
- Share `.env.example` with team, not `.env`

## Environment Variables

```bash
# .env file
VITE_MISTRAL_API_KEY=your_api_key_here
```

Note: Vite requires `VITE_` prefix for environment variables to be exposed to the client.

## AI Features Overview

### 1. Natural Language Processing
- Converts plain text to structured tasks
- Extracts: title, description, priority, tags, status
- Example: "urgent bug fix for payment gateway" → structured task

### 2. Task Enhancement
- Improves task descriptions
- Suggests relevant tags
- Recommends priority levels
- Estimates completion time
- Breaks down into subtasks

### 3. Productivity Analytics
- Analyzes task distribution
- Identifies bottlenecks
- Detects productivity patterns
- Provides actionable recommendations

### 4. Smart Prioritization
- Evaluates all tasks
- Suggests priority adjustments
- Explains reasoning
- One-click application

## Best Practices

1. **Provide Context**: More detailed tasks get better AI suggestions
2. **Review Suggestions**: AI is helpful but not perfect, review before applying
3. **Iterate**: Use AI suggestions as a starting point, refine as needed
4. **Rate Limits**: Don't spam AI requests, be mindful of API limits

## Support

If AI features still don't work:
1. Check browser console for errors
2. Verify API key is valid
3. Test API key with curl:
```bash
curl https://api.mistral.ai/v1/chat/completions \
  -X POST \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"model": "mistral-large-latest", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Next Steps

- Explore all AI features
- Customize prompts in `src/services/mistralAI.js`
- Add more AI capabilities
- Integrate with other AI models