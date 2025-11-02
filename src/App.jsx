import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from './components/Header';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import AIInsightsModal from './components/AIInsightsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Auth from './components/Auth';
import { useTheme } from './hooks/useTheme';
import mistralAI from './services/mistralAI';
import { authService, taskService } from './services/supabase';

const COLUMNS = {
    backlog: 'Backlog',
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const { theme, toggleTheme } = useTheme();

    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Check authentication status on mount
    useEffect(() => {
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                loadTasks(session.user.id);
            } else {
                setTasks([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
                await loadTasks(currentUser.id);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTasks = async (userId) => {
        try {
            const data = await taskService.getTasks(userId);
            const formattedTasks = data.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                tags: task.tags || [],
                aiEnhanced: task.ai_enhanced || false,
                aiSuggestedTags: task.ai_suggested_tags || [],
                createdAt: task.created_at,
                updatedAt: task.updated_at
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleAuth = async (email, password, isSignUp) => {
        if (isSignUp) {
            await authService.signUp(email, password);
            alert('Account created! Please check your email to verify.');
        } else {
            await authService.signIn(email, password);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.signOut();
            setTasks([]);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Task CRUD operations
    const createTask = useCallback(async (taskData) => {
        if (!user) return;

        try {
            const newTask = await taskService.createTask(user.id, taskData);
            const formattedTask = {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                status: newTask.status,
                tags: newTask.tags || [],
                aiEnhanced: newTask.ai_enhanced || false,
                aiSuggestedTags: newTask.ai_suggested_tags || [],
                createdAt: newTask.created_at,
                updatedAt: newTask.updated_at
            };
            setTasks(prev => [...prev, formattedTask]);
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        }
    }, [user]);

    const updateTask = useCallback(async (taskId, taskData) => {
        if (!user) return;

        try {
            await taskService.updateTask(taskId, taskData);
            setTasks(prev => prev.map(task =>
                task.id === taskId
                    ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
                    : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    }, [user]);

    const deleteTask = useCallback(async (taskId) => {
        if (!user) return;

        try {
            await taskService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    }, [user]);

    const moveTask = useCallback(async (taskId, newStatus) => {
        if (!user) return;

        try {
            await taskService.updateTask(taskId, { status: newStatus });
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (error) {
            console.error('Error moving task:', error);
            alert('Failed to move task');
        }
    }, [user]);

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

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="ai-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Auth onAuth={handleAuth} />;
    }

    return (
        <div className="app">
            <Header
                theme={theme}
                onToggleTheme={toggleTheme}
                onAddTask={handleAddTask}
                onOpenAIInsights={() => setIsAIInsightsOpen(true)}
                user={user}
                onLogout={handleLogout}
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