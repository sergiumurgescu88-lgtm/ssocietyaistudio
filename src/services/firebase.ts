import { supabase } from "@/integrations/supabase/client";

export const firebaseService = {
  // Auth
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  // Projects
  async createProject(projectData: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...projectData, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: Record<string, unknown>) {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId);
    if (error) throw error;
  },

  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
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
    // Initial fetch
    this.getProjects().then(callback);

    // Realtime subscription
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
