import React, { useState, useEffect } from 'react';
import { X, Archive, Sparkles, Loader, RotateCcw, Trash2 } from 'lucide-react';
import mistralAI from '../services/mistralAI';

const ArchiveModal = ({ isOpen, onClose, archivedTasks, onUnarchive, onDelete }) => {
    const [sortedCategories, setSortedCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'ai-sorted'

    useEffect(() => {
        if (isOpen && archivedTasks.length > 0 && viewMode === 'ai-sorted') {
            sortWithAI();
        }
    }, [isOpen, viewMode]);

    const sortWithAI = async () => {
        setIsLoading(true);
        try {
            const result = await mistralAI.sortArchivedTasks(archivedTasks);
            setSortedCategories(result.categories || []);
        } catch (error) {
            console.error('AI sorting failed:', error);
            alert('Failed to sort with AI');
        } finally {
            setIsLoading(false);
        }
    };

    const getTaskById = (taskId) => {
        return archivedTasks.find(t => t.id === taskId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal show">
            <div className="modal-content" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h3>
                        <Archive size={20} />
                        Archived Tasks ({archivedTasks.length})
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {archivedTasks.length === 0 ? (
                        <div className="empty-state">
                            <Archive size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>No archived tasks yet</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <button
                                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    List View
                                </button>
                                <button
                                    className={`btn ${viewMode === 'ai-sorted' ? 'btn-ai' : 'btn-secondary'}`}
                                    onClick={() => setViewMode('ai-sorted')}
                                >
                                    <Sparkles size={16} />
                                    AI Sorted
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="ai-loading" style={{ justifyContent: 'center', padding: '2rem' }}>
                                    <Loader size={24} className="ai-spinner" />
                                    <span>AI is organizing your tasks...</span>
                                </div>
                            ) : (
                                <>
                                    {viewMode === 'list' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {archivedTasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    style={{
                                                        background: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: '6px',
                                                        padding: '1rem'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                                {task.title}
                                                            </div>
                                                            {task.description && (
                                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                                    {task.description}
                                                                </div>
                                                            )}
                                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                                <span className={`task-priority priority-${task.priority}`}>
                                                                    <div className="priority-dot"></div>
                                                                    {task.priority}
                                                                </span>
                                                                {task.tags && task.tags.length > 0 && (
                                                                    <div className="task-tags">
                                                                        {task.tags.map((tag, idx) => (
                                                                            <span key={idx} className="task-tag">{tag}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                                                    Archived: {formatDate(task.archivedAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={() => onUnarchive(task.id)}
                                                                title="Restore task"
                                                                style={{ padding: '0.5rem' }}
                                                            >
                                                                <RotateCcw size={16} />
                                                            </button>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => onDelete(task.id)}
                                                                title="Delete permanently"
                                                                style={{ padding: '0.5rem' }}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {viewMode === 'ai-sorted' && sortedCategories.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {sortedCategories.map((category, idx) => (
                                                <div key={idx} className="ai-suggestions">
                                                    <h4 style={{ marginBottom: '0.5rem' }}>
                                                        {category.name}
                                                    </h4>
                                                    {category.description && (
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                                            {category.description}
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        {category.taskIds.map(taskId => {
                                                            const task = getTaskById(taskId);
                                                            if (!task) return null;
                                                            return (
                                                                <div
                                                                    key={taskId}
                                                                    style={{
                                                                        background: 'var(--bg-secondary)',
                                                                        border: '1px solid var(--border-color)',
                                                                        borderRadius: '6px',
                                                                        padding: '0.75rem',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                                            {task.title}
                                                                        </div>
                                                                        {task.tags && task.tags.length > 0 && (
                                                                            <div className="task-tags" style={{ marginTop: '0.25rem' }}>
                                                                                {task.tags.map((tag, tagIdx) => (
                                                                                    <span key={tagIdx} className="task-tag">{tag}</span>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                        <button
                                                                            className="task-action-btn"
                                                                            onClick={() => onUnarchive(task.id)}
                                                                            title="Restore"
                                                                        >
                                                                            <RotateCcw size={14} />
                                                                        </button>
                                                                        <button
                                                                            className="task-action-btn delete"
                                                                            onClick={() => onDelete(task.id)}
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {viewMode === 'ai-sorted' && sortedCategories.length === 0 && !isLoading && (
                                        <div className="empty-state">
                                            <p>Click "AI Sorted" to organize your archived tasks</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArchiveModal;