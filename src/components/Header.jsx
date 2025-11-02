import React from 'react';
import { Moon, Sun, Plus, Sparkles } from 'lucide-react';

const Header = ({ theme, onToggleTheme, onAddTask, onOpenAIInsights }) => {
    return (
        <header className="header">
            <h1>AI Kanban Board</h1>
            <div className="header-actions">
                <button
                    onClick={onOpenAIInsights}
                    className="btn btn-ai"
                    title="AI Productivity Insights"
                >
                    <Sparkles size={16} />
                    AI Insights
                </button>
                <button
                    onClick={onToggleTheme}
                    className="btn btn-secondary theme-toggle"
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    <span className="theme-icon">
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </span>
                </button>
                <button onClick={onAddTask} className="btn btn-primary">
                    <Plus size={16} />
                    Add Task
                </button>
            </div>
        </header>
    );
};

export default Header;