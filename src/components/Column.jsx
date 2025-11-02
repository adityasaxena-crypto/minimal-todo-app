import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({
    columnId,
    title,
    tasks,
    onEditTask,
    onDeleteTask,
    onAIEnhanceTask
}) => {
    return (
        <div className="column" data-status={columnId}>
            <div className="column-header">
                <h2>{title}</h2>
                <span className="task-count">{tasks.length}</span>
            </div>

            <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`task-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    >
                        {tasks.length === 0 ? (
                            <div className="empty-state">No tasks yet</div>
                        ) : (
                            tasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onEdit={onEditTask}
                                    onDelete={onDeleteTask}
                                    onAIEnhance={onAIEnhanceTask}
                                />
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;