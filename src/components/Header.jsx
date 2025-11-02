import React from 'react';
import { Moon, Sun, Plus, Sparkles, LogOut, User } from 'lucide-react';

const Header = ({ theme, onToggleTheme, onAddTask, onOpenAIInsights, user, onLogout }) => {
    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1>AI Kanban Board</h1>
                {user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)'
                    }}>
                        <User size={14} />
                        {user.email}
                    </div>
                )}
            </div>
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
                {user && (
                    <button onClick={onLogout} className="btn btn-secondary" title="Logout">
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;