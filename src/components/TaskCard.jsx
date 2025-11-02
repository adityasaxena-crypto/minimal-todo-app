import React from 'react';
import { Edit, Trash2, Sparkles } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onEdit, onDelete, onAIEnhance }) => {
    const priorityClass = `priority-${task.priority}`;
    const createdDate = new Date(task.createdAt).toLocaleDateString();

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${task.aiEnhanced ? 'ai-enhanced' : ''
                        }`}
                >
                    {task.aiEnhanced && (
                        <div className="ai-badge" title="AI Enhanced">
                            ✨
                        </div>
                    )}

                    <div className="task-header">
                        <div className="task-title">{task.title}</div>
                        <div className="task-actions">
                            <button
                                className="task-action-btn ai"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAIEnhance(task);
                                }}
                                title="AI Enhance"
                            >
                                <Sparkles size={12} />
                            </button>
                            <button
                                className="task-action-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(task);
                                }}
                                title="Edit task"
                            >
                                <Edit size={12} />
                            </button>
                            <button
                                className="task-action-btn delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                title="Delete task"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <div className="task-description">{task.description}</div>
                    )}

                    <div className="task-meta">
                        <div className={`task-priority ${priorityClass}`}>
                            <div className="priority-dot"></div>
                            <span>{task.priority}</span>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                            <div className="task-tags">
                                {task.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className={`task-tag ${task.aiSuggestedTags?.includes(tag) ? 'ai-suggested' : ''}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="task-date">Created: {createdDate}</div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;