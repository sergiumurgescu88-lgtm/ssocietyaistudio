import { supabase } from "@/integrations/supabase/client";
import { activityLogService } from "./activityLog";

export const firebaseService = {
  // Auth
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      activityLogService.log({ type: 'auth', status: 'error', title: 'Sign Up Failed', description: error.message });
      throw error;
    }
    activityLogService.log({ type: 'auth', status: 'success', title: 'User Signed Up', description: `New account: ${email}` });
    return data.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      activityLogService.log({ type: 'auth', status: 'warning', title: 'Failed Login Attempt', description: error.message });
      throw error;
    }
    activityLogService.log({ type: 'auth', status: 'success', title: 'User Login', description: `Logged in with email` });
    return data.user;
  },

  async logout() {
    activityLogService.log({ type: 'auth', status: 'success', title: 'User Logout', description: 'User signed out' });
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    activityLogService.log({ type: 'auth', status: 'success', title: 'Password Reset Requested', description: `Reset email sent to ${email}` });
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    activityLogService.log({ type: 'settings', status: 'success', title: 'Password Updated', description: 'Password changed successfully' });
  },

  // Projects
  async createProject(projectData: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, user_id: user.id } as any])
      .select()
      .single();
    if (error) throw error;
    activityLogService.log({ type: 'save', status: 'success', title: 'Project Created', description: `Created: ${projectData.name || 'Untitled'}`, project_id: data.id });
    return data;
  },

  async updateProject(projectId: string, updates: Record<string, unknown>) {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);
    if (error) throw error;
    activityLogService.log({ type: 'save', status: 'success', title: 'Project Updated', project_id: projectId });
  },

  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
    activityLogService.log({ type: 'delete', status: 'success', title: 'Project Deleted', project_id: projectId });
  },

  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  subscribeToProjects(callback: (projects: any[]) => void) {
    this.getProjects().then(callback);
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        this.getProjects().then(callback);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  // Storage
  async uploadFile(file: File, path: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fullPath = `${user.id}/${path}`;
    const { error } = await supabase.storage.from('assets').upload(fullPath, file, { upsert: true });
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(fullPath);
    return urlData.publicUrl;
  },
};
