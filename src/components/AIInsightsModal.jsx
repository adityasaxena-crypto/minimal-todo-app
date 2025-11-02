import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import mistralAI from '../services/mistralAI';

const AIInsightsModal = ({ isOpen, onClose, tasks, onApplyRecommendation }) => {
    const [insights, setInsights] = useState(null);
    const [priorityRecommendations, setPriorityRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('insights');

    useEffect(() => {
        if (isOpen && tasks.length > 0) {
            loadAIInsights();
        } else if (isOpen && tasks.length === 0) {
            setInsights(null);
            setPriorityRecommendations(null);
        }
    }, [isOpen]);

    const loadAIInsights = async () => {
        setIsLoading(true);
        setInsights(null);
        setPriorityRecommendations(null);

        try {
            console.log('Loading AI insights for tasks:', tasks.length);

            // Load insights sequentially to avoid rate limits
            const productivityInsights = await mistralAI.analyzeProductivity(tasks);
            console.log('Productivity insights:', productivityInsights);
            setInsights(productivityInsights);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

            const priorityRecs = await mistralAI.smartPrioritization(tasks);
            console.log('Priority recommendations:', priorityRecs);
            setPriorityRecommendations(priorityRecs);

        } catch (error) {
            console.error('Failed to load AI insights:', error);
            alert(`Failed to load AI insights: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'bottleneck':
                return <AlertTriangle size={16} className="text-warning" />;
            case 'pattern':
                return <TrendingUp size={16} className="text-info" />;
            case 'recommendation':
                return <CheckCircle size={16} className="text-success" />;
            default:
                return <Sparkles size={16} />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'var(--danger)';
            case 'medium':
                return 'var(--warning)';
            case 'low':
                return 'var(--success)';
            default:
                return 'var(--text-muted)';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal show">
            <div className="modal-content" style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <h3>
                        <Sparkles size={20} />
                        AI Productivity Insights
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks available for analysis. Create some tasks first!</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                                <button
                                    className={`btn ${activeTab === 'insights' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveTab('insights')}
                                >
                                    Productivity Insights
                                </button>
                                <button
                                    className={`btn ${activeTab === 'priorities' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveTab('priorities')}
                                >
                                    Priority Recommendations
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="ai-loading" style={{ justifyContent: 'center', padding: '2rem' }}>
                                    <Loader size={24} className="ai-spinner" />
                                    <span>Analyzing your tasks with AI...</span>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'insights' && !insights && (
                                        <div className="empty-state">
                                            <p>Click "Refresh Analysis" to generate AI insights</p>
                                        </div>
                                    )}

                                    {activeTab === 'insights' && insights && (
                                        <div>
                                            {insights.summary && (
                                                <div className="ai-suggestions" style={{ marginBottom: '1.5rem' }}>
                                                    <h4>Summary</h4>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                                        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                                                {insights.summary.totalTasks}
                                                            </div>
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Tasks</div>
                                                        </div>
                                                        <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                                                {insights.summary.completionRate}
                                                            </div>
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completion Rate</div>
                                                        </div>
                                                        {insights.summary.averageTimeInProgress && (
                                                            <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                                                    {insights.summary.averageTimeInProgress}
                                                                </div>
                                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Avg. Time</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {insights.summary.mostCommonTags && insights.summary.mostCommonTags.length > 0 && (
                                                        <div style={{ marginTop: '1rem' }}>
                                                            <strong>Most Common Tags:</strong>
                                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                                                {insights.summary.mostCommonTags.map((tag, index) => (
                                                                    <span key={index} className="task-tag">{tag}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {insights.insights && insights.insights.length > 0 && (
                                                <div>
                                                    <h4 style={{ marginBottom: '1rem' }}>Detailed Insights</h4>
                                                    {insights.insights.map((insight, index) => (
                                                        <div
                                                            key={index}
                                                            className="ai-suggestion-item"
                                                            style={{
                                                                borderLeft: `4px solid ${getSeverityColor(insight.severity)}`,
                                                                marginBottom: '1rem'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                {getInsightIcon(insight.type)}
                                                                <strong>{insight.title}</strong>
                                                                <span
                                                                    style={{
                                                                        fontSize: '0.75rem',
                                                                        padding: '0.125rem 0.5rem',
                                                                        borderRadius: '12px',
                                                                        background: getSeverityColor(insight.severity),
                                                                        color: 'white'
                                                                    }}
                                                                >
                                                                    {insight.severity}
                                                                </span>
                                                            </div>
                                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                                {insight.description}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'priorities' && !priorityRecommendations && (
                                        <div className="empty-state">
                                            <p>Click "Refresh Analysis" to generate priority recommendations</p>
                                        </div>
                                    )}

                                    {activeTab === 'priorities' && priorityRecommendations && (
                                        <div>
                                            <h4 style={{ marginBottom: '1rem' }}>Smart Priority Recommendations</h4>
                                            {priorityRecommendations.recommendations && priorityRecommendations.recommendations.length > 0 ? (
                                                priorityRecommendations.recommendations.map((rec, index) => {
                                                    const task = tasks.find(t => t.id === rec.taskId);
                                                    if (!task) return null;

                                                    return (
                                                        <div key={index} className="ai-suggestion-item" style={{ marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                                <div>
                                                                    <strong>{task.title}</strong>
                                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                                                        Current: <span className={`priority-${rec.currentPriority}`}>{rec.currentPriority}</span>
                                                                        {' → '}
                                                                        Recommended: <span className={`priority-${rec.recommendedPriority}`}>{rec.recommendedPriority}</span>
                                                                    </div>
                                                                </div>
                                                                {rec.currentPriority !== rec.recommendedPriority && (
                                                                    <button
                                                                        className="btn btn-ai"
                                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                                        onClick={() => onApplyRecommendation(task.id, rec.recommendedPriority)}
                                                                    >
                                                                        Apply
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                                {rec.reason}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="empty-state">
                                                    <p>No priority changes recommended. Your task priorities look good!</p>
                                                </div>
                                            )}
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
                        {tasks.length > 0 && (
                            <button className="btn btn-ai" onClick={loadAIInsights} disabled={isLoading}>
                                <Sparkles size={16} />
                                Refresh Analysis
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIInsightsModal;