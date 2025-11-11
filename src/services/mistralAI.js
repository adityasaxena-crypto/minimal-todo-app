const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || '3Ob7VG3QcqTLE5mbUmBWkD8NnP1nHoke';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

class MistralAIService {
    constructor() {
        this.apiKey = MISTRAL_API_KEY;
        this.apiUrl = MISTRAL_API_URL;
    }

    // Helper function to clean and sanitize JSON strings
    sanitizeJSON(jsonString) {
        try {
            // Remove markdown code blocks
            let cleaned = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Try to parse first - if it works, return as is
            JSON.parse(cleaned);
            return cleaned;
        } catch (e) {
            // If parsing fails, do aggressive cleaning
            let cleaned = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            // Remove control characters except newlines and tabs in the raw string
            cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

            // Replace literal newlines and tabs with escaped versions
            cleaned = cleaned.replace(/(?<!\\)\n/g, ' ').replace(/(?<!\\)\r/g, '').replace(/(?<!\\)\t/g, ' ');

            // Remove multiple spaces
            cleaned = cleaned.replace(/\s+/g, ' ');

            return cleaned;
        }
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
            const cleanResponse = this.sanitizeJSON(response);
            console.log('Cleaned response:', cleanResponse);
            return JSON.parse(cleanResponse);
        } catch (error) {
            console.error('Task enhancement failed:', error);
            console.error('Raw response:', response);
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
            const cleanResponse = this.sanitizeJSON(response);
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
            const cleanResponse = this.sanitizeJSON(response);
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
            const cleanResponse = this.sanitizeJSON(response);
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
                content: `You are a productivity analyst. Respond with ONLY valid JSON. No markdown, no code blocks. Keep all text in single lines without line breaks. Use simple short descriptions under 100 characters. Required structure: {"insights":[{"type":"bottleneck","title":"Short title","description":"Brief description","severity":"high"}],"summary":{"totalTasks":5,"completionRate":"60%","averageTimeInProgress":"2 days","mostCommonTags":["tag1"]}}`
            },
            {
                role: 'user',
                content: `Analyze ${tasks.length} tasks. Provide 2-3 insights max. Keep descriptions under 100 chars. Tasks: ${JSON.stringify(taskSummary).substring(0, 1000)}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = this.sanitizeJSON(response);
            console.log('Cleaned productivity response:', cleanResponse);
            const parsed = JSON.parse(cleanResponse);

            // Ensure the response has the expected structure
            if (!parsed.insights) parsed.insights = [];
            if (!parsed.summary) {
                parsed.summary = {
                    totalTasks: tasks.length,
                    completionRate: `${Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)}%`,
                    averageTimeInProgress: 'N/A',
                    mostCommonTags: []
                };
            }

            return parsed;
        } catch (error) {
            console.error('Productivity analysis failed:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    }

    async smartPrioritization(tasks) {
        const taskData = tasks.map(t => ({
            id: t.id,
            title: t.title,
            priority: t.priority,
            status: t.status
        }));

        const messages = [
            {
                role: 'system',
                content: `You are a task prioritization AI. Respond with ONLY valid JSON. No markdown, no code blocks. Keep reasons under 80 characters. Required structure: {"recommendations":[{"taskId":"task_123","currentPriority":"low","recommendedPriority":"high","reason":"Short reason"}]}`
            },
            {
                role: 'user',
                content: `Suggest priority changes for ${tasks.length} tasks. Max 3 recommendations. Keep reasons under 80 chars. Tasks: ${JSON.stringify(taskData).substring(0, 1000)}`
            }
        ];

        try {
            const response = await this.makeRequest(messages);
            const cleanResponse = this.sanitizeJSON(response);
            console.log('Cleaned prioritization response:', cleanResponse);
            const parsed = JSON.parse(cleanResponse);

            // Ensure the response has the expected structure
            if (!parsed.recommendations) parsed.recommendations = [];

            return parsed;
        } catch (error) {
            console.error('Smart prioritization failed:', error);
            console.error('Error details:', error.message);
            throw error;
        }
    }
}

    async sortArchivedTasks(tasks) {
    const taskData = tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        tags: t.tags,
        archivedAt: t.archivedAt
    }));

    const messages = [
        {
            role: 'system',
            content: `You are an AI that organizes archived tasks intelligently. Group and sort tasks by themes, projects, or categories. Respond with ONLY valid JSON. Structure: {"categories":[{"name":"Category Name","description":"Brief description","taskIds":["id1","id2"]}]}`
        },
        {
            role: 'user',
            content: `Organize these ${tasks.length} archived tasks into logical categories. Max 5 categories. Tasks: ${JSON.stringify(taskData).substring(0, 2000)}`
        }
    ];

    try {
        const response = await this.makeRequest(messages);
        const cleanResponse = this.sanitizeJSON(response);
        console.log('Cleaned archive sort response:', cleanResponse);
        const parsed = JSON.parse(cleanResponse);

        if (!parsed.categories) parsed.categories = [];

        return parsed;
    } catch (error) {
        console.error('Archive sorting failed:', error);
        return { categories: [] };
    }
}
}

export default new MistralAIService();