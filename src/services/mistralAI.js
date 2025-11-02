const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || '3Ob7VG3QcqTLE5mbUmBWkD8NnP1nHoke';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

class MistralAIService {
    constructor() {
        this.apiKey = MISTRAL_API_KEY;
        this.apiUrl = MISTRAL_API_URL;
    }

    async makeRequest(messages, options = {}) {
        if (!this.apiKey) {
            throw new Error('Mistral API key is not configured');
        }

        try {
            console.log('Making Mistral AI request...', { messages });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mistral-large-latest',
                    messages: messages,
                    max_tokens: options.maxTokens || 1500,
                    temperature: options.temperature || 0.7,
                    ...options
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Mistral API error:', errorData);
                throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Mistral AI response:', data);
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Mistral AI request failed:', error);
            throw error;
        }
    }

    async enhanceTask(taskData) {
        // Handle tags - could be string or array
        const tagsString = Array.isArray(taskData.tags)
            ? taskData.tags.join(', ')
            : (taskData.tags || 'No tags');

        const messages = [
            {
                role: 'system',
                content: `You are an AI assistant that helps improve task management. Analyze the given task and provide suggestions for improvement, better descriptions, appropriate tags, and priority recommendations. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
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
Title: ${taskData.title}
Description: ${taskData.description || 'No description provided'}
Current Priority: ${taskData.priority}
Current Tags: ${tagsString}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            // Remove markdown code blocks if present
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Task enhancement failed:', error);
            return null;
        }
    }

    async generateSubtasks(taskTitle, taskDescription = '') {
        const messages = [
            {
                role: 'system',
                content: `You are a project management AI. Break down the given task into smaller, actionable subtasks. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "subtasks": [
    {
      "title": "subtask title",
      "description": "subtask description",
      "priority": "low|medium|high",
      "tags": ["tag1", "tag2"]
    }
  ]
}`
            },
            {
                role: 'user',
                content: `Break down this task into smaller subtasks:
Title: ${taskTitle}
Description: ${taskDescription}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Subtask generation failed:', error);
            return { subtasks: [] };
        }
    }

    async parseNaturalLanguage(input) {
        const messages = [
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
                content: `Parse this natural language input into a structured task: "${input}"`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Natural language parsing failed:', error);
            return null;
        }
    }

    async suggestTags(taskTitle, taskDescription = '') {
        const messages = [
            {
                role: 'system',
                content: `You are a task categorization AI. Suggest relevant tags for the given task. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "tags": ["tag1", "tag2", "tag3"]
}`
            },
            {
                role: 'user',
                content: `Suggest tags for this task:
Title: ${taskTitle}
Description: ${taskDescription}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const result = JSON.parse(cleanResponse);
            return result.tags || [];
        } catch (error) {
            console.error('Tag suggestion failed:', error);
            return [];
        }
    }

    async analyzeProductivity(tasks) {
        const taskSummary = tasks.map(task => ({
            title: task.title,
            status: task.status,
            priority: task.priority,
            createdAt: task.createdAt,
            tags: task.tags
        }));

        const messages = [
            {
                role: 'system',
                content: `You are a productivity analyst. Analyze the given tasks and provide insights about productivity patterns, bottlenecks, and recommendations. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "insights": [
    {
      "type": "bottleneck|pattern|recommendation",
      "title": "insight title",
      "description": "detailed description",
      "severity": "low|medium|high"
    }
  ],
  "summary": {
    "totalTasks": 0,
    "completionRate": "0%",
    "averageTimeInProgress": "N/A",
    "mostCommonTags": ["tag1", "tag2"]
  }
}`
            },
            {
                role: 'user',
                content: `Analyze these tasks for productivity insights: ${JSON.stringify(taskSummary)}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Productivity analysis failed:', error);
            return null;
        }
    }

    async smartPrioritization(tasks) {
        const messages = [
            {
                role: 'system',
                content: `You are a task prioritization AI. Analyze the given tasks and suggest optimal priority levels based on urgency, importance, and dependencies. Respond ONLY with valid JSON, no markdown formatting. Use this exact structure:
{
  "recommendations": [
    {
      "taskId": "task_id",
      "currentPriority": "current",
      "recommendedPriority": "recommended",
      "reason": "explanation for the change"
    }
  ]
}`
            },
            {
                role: 'user',
                content: `Analyze and suggest priority changes for these tasks: ${JSON.stringify(tasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    priority: t.priority,
                    status: t.status,
                    tags: t.tags
                })))}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Smart prioritization failed:', error);
            return { recommendations: [] };
        }
    }
}

export default new MistralAIService();