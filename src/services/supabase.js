import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const authService = {
    // Sign up with email and password
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign in with email and password
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Listen to auth changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Task database operations
export const taskService = {
    // Get all tasks for current user (excluding archived)
    async getTasks(userId) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('archived', false)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Get archived tasks for current user
    async getArchivedTasks(userId) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('archived', true)
            .order('archived_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Create a new task
    async createTask(userId, task) {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                user_id: userId,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                tags: task.tags,
                ai_enhanced: task.aiEnhanced || false,
                ai_suggested_tags: task.aiSuggestedTags || []
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update a task
    async updateTask(taskId, updates) {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                title: updates.title,
                description: updates.description,
                priority: updates.priority,
                status: updates.status,
                tags: updates.tags,
                ai_enhanced: updates.aiEnhanced,
                ai_suggested_tags: updates.aiSuggestedTags,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete a task
    async deleteTask(taskId) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) throw error;
    },

    // Archive a task
    async archiveTask(taskId) {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                archived: true,
                archived_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Unarchive a task
    async unarchiveTask(taskId) {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                archived: false,
                archived_at: null
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Subscribe to task changes
    subscribeToTasks(userId, callback) {
        return supabase
            .channel('tasks')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `user_id=eq.${userId}`
                },
                callback
            )
            .subscribe();
    }
};