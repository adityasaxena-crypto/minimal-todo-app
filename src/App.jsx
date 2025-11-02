import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from './components/Header';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import AIInsightsModal from './components/AIInsightsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import mistralAI from './services/mistralAI';

const COLUMNS = {
    backlog: 'Backlog',
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
};

function App() {
    const [tasks, setTasks] = useLocalStorage('kanban_tasks', []);
    const { theme, toggleTheme } = useTheme();

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Generate unique ID for tasks
    const generateId = () => {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    // Task CRUD operations
    const createTask = useCallback((taskData) => {
        const newTask = {
            id: generateId(),
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            aiEnhanced: false,
            aiSuggestedTags: []
        };

        setTasks(prev => [...prev, newTask]);
    }, [setTasks]);

    const updateTask = useCallback((taskId, taskData) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
                : task
        ));
    }, [setTasks]);

    const deleteTask = useCallback((taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }, [setTasks]);

    const moveTask = useCallback((taskId, newStatus) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    }, [setTasks]);

    // Modal handlers
    const handleAddTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = (taskData) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            createTask(taskData);
        }
    };

    const handleDeleteTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    // AI Enhancement
    const handleAIEnhanceTask = async (task) => {
        try {
            const suggestions = await mistralAI.enhanceTask(task);
            if (suggestions) {
                // Apply AI suggestions to the task
                const enhancedTask = {
                    ...task,
                    aiEnhanced: true,
                    aiSuggestedTags: suggestions.recommendedTags || [],
                };

                // If there are recommended changes, show them in edit modal
                setEditingTask(enhancedTask);
                setIsTaskModalOpen(true);
            }
        } catch (error) {
            console.error('AI enhancement failed:', error);
            alert('AI enhancement failed. Please try again.');
        }
    };

    const handleApplyPriorityRecommendation = (taskId, newPriority) => {
        updateTask(taskId, { priority: newPriority });
    };

    // Drag and Drop
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        moveTask(draggableId, destination.droppableId);
    };

    // Get tasks by status
    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <div className="app">
            <Header
                theme={theme}
                onToggleTheme={toggleTheme}
                onAddTask={handleAddTask}
                onOpenAIInsights={() => setIsAIInsightsOpen(true)}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <main className="board">
                    {Object.entries(COLUMNS).map(([columnId, title]) => (
                        <Column
                            key={columnId}
                            columnId={columnId}
                            title={title}
                            tasks={getTasksByStatus(columnId)}
                            onEditTask={handleEditTask}
                            onDeleteTask={handleDeleteTask}
                            onAIEnhanceTask={handleAIEnhanceTask}
                        />
                    ))}
                </main>
            </DragDropContext>

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
            />

            <AIInsightsModal
                isOpen={isAIInsightsOpen}
                onClose={() => setIsAIInsightsOpen(false)}
                tasks={tasks}
                onApplyRecommendation={handleApplyPriorityRecommendation}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                taskTitle={taskToDelete?.title || ''}
            />
        </div>
    );
}

export default App;