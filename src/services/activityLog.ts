import { supabase } from "@/integrations/supabase/client";

export type ActivityType = 'auth' | 'generation' | 'publishing' | 'error' | 'save' | 'delete' | 'settings' | 'billing';
export type ActivityStatus = 'success' | 'warning' | 'error';

interface LogEntry {
  type: ActivityType;
  status: ActivityStatus;
  title: string;
  description?: string;
  project_id?: string;
  metadata?: Record<string, unknown>;
}

export const activityLogService = {
  async log(entry: LogEntry) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('activity_logs' as any).insert({
      user_id: user.id,
      type: entry.type,
      status: entry.status,
      title: entry.title,
      description: entry.description || '',
      project_id: entry.project_id || null,
      metadata: entry.metadata || {},
    } as any);
  },

  async getLogs(filters?: {
    type?: ActivityType;
    limit?: number;
    offset?: number;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { logs: [], count: 0 };

    let query = supabase
      .from('activity_logs' as any)
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters?.limit || 20) - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { logs: (data || []) as any[], count: count || 0 };
  },

  async getSummary() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: 0, error: 0, auth: 0, publishing: 0, generation: 0 };

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('activity_logs' as any)
      .select('type, status')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo) as any;

    const logs = (data || []) as any[];
    return {
      success: logs.filter((l: any) => l.status === 'success').length,
      error: logs.filter((l: any) => l.status === 'error').length,
      auth: logs.filter((l: any) => l.type === 'auth').length,
      publishing: logs.filter((l: any) => l.type === 'publishing').length,
      generation: logs.filter((l: any) => l.type === 'generation').length,
    };
  },
};
