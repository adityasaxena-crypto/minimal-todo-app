// Test script to check Mistral AI API response format
const MISTRAL_API_KEY = '3Ob7VG3QcqTLE5mbUmBWkD8NnP1nHoke';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

async function testMistralAPI() {
    console.log('Testing Mistral AI API...\n');

    // Test 1: Task Enhancement
    console.log('=== Test 1: Task Enhancement ===');
    try {
        const response1 = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant that helps improve task management. Analyze the given task and provide suggestions. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "suggestions": ["suggestion1", "suggestion2"],
  "improvedDescription": "enhanced description",
  "recommendedTags": ["tag1", "tag2"],
  "recommendedPriority": "low|medium|high",
  "estimatedTime": "time estimate",
  "subtasks": ["subtask1", "subtask2"]
}`
                    },
                    {
                        role: 'user',
                        content: `Analyze this task:
Title: Fix login bug
Description: Users can't log in with Google OAuth
Current Priority: medium
Current Tags: bug, authentication`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        const data1 = await response1.json();
        console.log('Response Status:', response1.status);
        console.log('Full Response:', JSON.stringify(data1, null, 2));
        console.log('Content:', data1.choices[0]?.message?.content);
        console.log('\n');
    } catch (error) {
        console.error('Test 1 Failed:', error);
    }

    // Test 2: Natural Language Parsing
    console.log('=== Test 2: Natural Language Parsing ===');
    try {
        const response2 = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: `You are a natural language parser for task creation. Parse the user's input and extract task information. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "title": "extracted title",
  "description": "extracted description",
  "priority": "low|medium|high",
  "tags": ["tag1", "tag2"],
  "status": "backlog|todo|inprogress|done"
}`
                    },
                    {
                        role: 'user',
                        content: `Parse this natural language input into a structured task: "Create a high priority task to fix the login bug with authentication and security tags"`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        const data2 = await response2.json();
        console.log('Response Status:', response2.status);
        console.log('Full Response:', JSON.stringify(data2, null, 2));
        console.log('Content:', data2.choices[0]?.message?.content);
        console.log('\n');
    } catch (error) {
        console.error('Test 2 Failed:', error);
    }

    // Test 3: Simple test
    console.log('=== Test 3: Simple Hello Test ===');
    try {
        const response3 = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'user',
                        content: 'Say hello in JSON format: {"message": "your message here"}'
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });

        const data3 = await response3.json();
        console.log('Response Status:', response3.status);
        console.log('Full Response:', JSON.stringify(data3, null, 2));
        console.log('Content:', data3.choices[0]?.message?.content);
    } catch (error) {
        console.error('Test 3 Failed:', error);
    }
}

testMistralAPI();