import React from 'react';
import { Moon, Sun, Plus, Sparkles, LogOut, User, Archive } from 'lucide-react';

const Header = ({ theme, onToggleTheme, onAddTask, onOpenAIInsights, onOpenArchive, user, onLogout }) => {
    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <h1>AI Kanban Board</h1>
                {user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        <User size={12} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                        </span>
                    </div>
                )}
            </div>
            <div className="header-actions">
                <button
                    onClick={onOpenArchive}
                    className="btn btn-secondary"
                    title="View Archived Tasks"
                >
                    <Archive size={16} />
                    <span>Archive</span>
                </button>
                <button
                    onClick={onOpenAIInsights}
                    className="btn btn-ai"
                    title="AI Productivity Insights"
                >
                    <Sparkles size={16} />
                    <span>AI Insights</span>
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
                    <span>Add Task</span>
                </button>
                {user && (
                    <button onClick={onLogout} className="btn btn-secondary" title="Logout">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;