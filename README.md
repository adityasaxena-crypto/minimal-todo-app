# AI-Powered Kanban Board

A modern, minimalistic kanban board application built with React and powered by Mistral AI. Features intelligent task management, natural language processing, and productivity insights.

## 🚀 Features

### Core Functionality
- **Kanban Board Layout**: 4 columns (Backlog, To Do, In Progress, Done)
- **Task Management**: Create, edit, and delete tasks with confirmation
- **Drag & Drop**: Smooth drag-and-drop between columns using react-beautiful-dnd
- **Data Persistence**: Auto-save to localStorage
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🤖 AI-Powered Features
- **Natural Language Task Creation**: "Create a high priority bug fix for login issues"
- **Task Enhancement**: AI analyzes and suggests improvements for tasks
- **Smart Tag Suggestions**: Automatically recommends relevant tags
- **Priority Recommendations**: AI suggests optimal priority levels
- **Productivity Insights**: Analyze patterns, bottlenecks, and completion rates
- **Smart Prioritization**: Get AI recommendations for task priority adjustments

### Task Properties
- Title (required)
- Description (optional)
- Priority levels (Low, Medium, High) with color indicators
- Tags/labels for categorization
- Creation date tracking
- AI enhancement indicators
- Status tracking across columns

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd ai-kanban-board
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### File Structure
```
ai-kanban-board/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx
│   │   ├── Column.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   ├── AIInsightsModal.jsx
│   │   └── DeleteConfirmModal.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   ├── services/           # API services
│   │   └── mistralAI.js
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Usage

### Creating Tasks

#### Standard Method
1. Click the "+ Add Task" button
2. Fill in the task details
3. Click "Save Task"

#### AI-Powered Natural Language Method
1. Click "+ Add Task"
2. Use the natural language input: 
   - "Create a high priority task to fix the login bug with authentication and security tags"
   - "Add a medium priority feature to implement dark mode"
3. Click "Parse with AI" to automatically extract task details

### AI Features

#### Task Enhancement
- Click the sparkle (✨) icon on any task card
- AI will analyze and suggest improvements:
  - Better descriptions
  - Recommended tags
  - Priority adjustments
  - Time estimates
  - Subtask breakdowns

#### Productivity Insights
- Click "AI Insights" in the header
- View comprehensive analysis:
  - Task completion rates
  - Bottleneck identification
  - Productivity patterns
  - Priority recommendations

### Managing Tasks
- **Edit**: Click the pencil icon on any task card
- **Delete**: Click the trash icon and confirm deletion
- **Move**: Drag and drop tasks between columns
- **AI Enhance**: Click the sparkle icon for AI suggestions

## 🔧 Configuration

### Mistral AI Integration
The application is pre-configured with Mistral AI. The API key is already set in `src/services/mistralAI.js`.

To use your own API key:
1. Open `src/services/mistralAI.js`
2. Replace the `MISTRAL_API_KEY` constant with your key
3. Restart the development server

### Customization

#### Styling
- Edit `src/index.css` to modify colors, fonts, and layout
- CSS custom properties make theme changes easy
- All components use consistent design tokens

#### Adding New Columns
1. Update the `COLUMNS` object in `src/App.jsx`
2. Add corresponding CSS styles if needed

#### Extending AI Features
The `MistralAIService` class in `src/services/mistralAI.js` provides methods for:
- `enhanceTask()` - Improve task details
- `generateSubtasks()` - Break down complex tasks
- `parseNaturalLanguage()` - Convert natural language to structured data
- `suggestTags()` - Recommend relevant tags
- `analyzeProductivity()` - Generate insights
- `smartPrioritization()` - Optimize task priorities

## 🎨 AI Features in Detail

### Natural Language Processing
```javascript
// Example inputs that work:
"Create a high priority task to fix login bug"
"Add medium priority feature for user dashboard"
"Bug fix for payment processing with urgent priority"
```

### Task Enhancement
AI analyzes your tasks and provides:
- Improved descriptions
- Relevant tag suggestions
- Priority recommendations
- Time estimates
- Subtask breakdowns

### Productivity Insights
- **Completion Rate**: Percentage of tasks completed
- **Bottleneck Detection**: Identifies columns with too many tasks
- **Pattern Analysis**: Discovers productivity trends
- **Smart Recommendations**: Actionable suggestions for improvement

## 🚀 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🌐 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## 🔒 Privacy & Security

- All data is stored locally in your browser
- AI requests are sent securely to Mistral AI
- No personal data is stored on external servers
- API key is used only for AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

Open source - feel free to use and modify for your projects.

## 🐛 Troubleshooting

### Tasks not saving
- Check browser console for localStorage errors
- Ensure you're not in private/incognito mode
- Clear browser cache and try again

### AI features not working
- Check network connectivity
- Verify Mistral AI API key is valid
- Review browser console for error messages
- Ensure you're not hitting API rate limits

### Drag and drop issues
- Ensure JavaScript is enabled
- Try refreshing the page
- Check for browser extensions that might interfere

## 🔮 Future Enhancements

- Due dates and calendar integration
- Task comments and activity history
- Team collaboration features
- Advanced filtering and search
- Export/import functionality
- Keyboard shortcuts
- Task templates
- Time tracking
- Push notifications
- Offline support