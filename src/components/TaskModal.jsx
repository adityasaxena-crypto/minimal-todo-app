import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader } from 'lucide-react';
import mistralAI from '../services/mistralAI';

const TaskModal = ({
    isOpen,
    onClose,
    onSave,
    task = null,
    onAIEnhance
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: 'backlog',
        tags: ''
    });

    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                tags: task.tags ? task.tags.join(', ') : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'backlog',
                tags: ''
            });
        }
        setAiSuggestions(null);
        setNaturalLanguageInput('');
    }, [task, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const taskData = {
            ...formData,
            tags: formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
        };

        onSave(taskData);
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAIEnhance = async () => {
        if (!formData.title.trim()) return;

        setIsLoadingAI(true);
        try {
            const suggestions = await mistralAI.enhanceTask(formData);
            if (suggestions) {
                setAiSuggestions(suggestions);
            } else {
                alert('AI enhancement returned no suggestions. Please try again.');
            }
        } catch (error) {
            console.error('AI enhancement failed:', error);
            alert(`AI enhancement failed: ${error.message}. Please check your API key and try again.`);
        } finally {
            setIsLoadingAI(false);
        }
    };

    const applySuggestion = (field, value) => {
        if (field === 'tags') {
            setFormData(prev => ({
                ...prev,
                tags: value.join(', ')
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleNaturalLanguageParse = async () => {
        if (!naturalLanguageInput.trim()) return;

        setIsLoadingAI(true);
        try {
            const parsed = await mistralAI.parseNaturalLanguage(naturalLanguageInput);
            if (parsed) {
                setFormData({
                    title: parsed.title || '',
                    description: parsed.description || '',
                    priority: parsed.priority || 'medium',
                    status: parsed.status || 'backlog',
                    tags: parsed.tags ? parsed.tags.join(', ') : ''
                });
                setNaturalLanguageInput('');
            } else {
                alert('Could not parse the input. Please try rephrasing.');
            }
        } catch (error) {
            console.error('Natural language parsing failed:', error);
            alert(`AI parsing failed: ${error.message}. Please check your API key and try again.`);
        } finally {
            setIsLoadingAI(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{task ? 'Edit Task' : 'Add New Task'}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {!task && (
                        <div className="form-group">
                            <label>Natural Language Input (AI Powered)</label>
                            <div className="nl-input-container">
                                <input
                                    type="text"
                                    className="nl-input"
                                    value={naturalLanguageInput}
                                    onChange={(e) => setNaturalLanguageInput(e.target.value)}
                                    placeholder="e.g., 'Create a high priority task to fix the login bug with authentication and security tags'"
                                />
                                <button
                                    type="button"
                                    className="btn btn-ai"
                                    onClick={handleNaturalLanguageParse}
                                    disabled={!naturalLanguageInput.trim() || isLoadingAI}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    {isLoadingAI ? <Loader size={16} className="ai-spinner" /> : <Sparkles size={16} />}
                                    Parse with AI
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="task-title">Title *</label>
                        <input
                            type="text"
                            id="task-title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea
                            id="task-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="task-priority">Priority</label>
                            <select
                                id="task-priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="task-status">Status</label>
                            <select
                                id="task-status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="task-tags">Tags (comma separated)</label>
                        <input
                            type="text"
                            id="task-tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="bug, feature, urgent"
                        />
                    </div>

                    {formData.title.trim() && (
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-ai"
                                onClick={handleAIEnhance}
                                disabled={isLoadingAI}
                            >
                                {isLoadingAI ? (
                                    <>
                                        <Loader size={16} className="ai-spinner" />
                                        Enhancing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        Enhance with AI
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {aiSuggestions && (
                        <div className="ai-suggestions">
                            <h4>
                                <Sparkles size={16} />
                                AI Suggestions
                            </h4>

                            {aiSuggestions.improvedDescription && (
                                <div className="ai-suggestion-item" onClick={() => applySuggestion('description', aiSuggestions.improvedDescription)}>
                                    <strong>Improved Description:</strong> {aiSuggestions.improvedDescription}
                                </div>
                            )}

                            {aiSuggestions.recommendedTags && (
                                <div className="ai-suggestion-item" onClick={() => applySuggestion('tags', aiSuggestions.recommendedTags)}>
                                    <strong>Recommended Tags:</strong> {aiSuggestions.recommendedTags.join(', ')}
                                </div>
                            )}

                            {aiSuggestions.recommendedPriority && (
                                <div className="ai-suggestion-item" onClick={() => applySuggestion('priority', aiSuggestions.recommendedPriority)}>
                                    <strong>Recommended Priority:</strong> {aiSuggestions.recommendedPriority}
                                </div>
                            )}

                            {aiSuggestions.estimatedTime && (
                                <div className="ai-suggestion-item">
                                    <strong>Estimated Time:</strong> {aiSuggestions.estimatedTime}
                                </div>
                            )}

                            {aiSuggestions.suggestions && aiSuggestions.suggestions.length > 0 && (
                                <div>
                                    <strong>General Suggestions:</strong>
                                    <ul style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                                        {aiSuggestions.suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;