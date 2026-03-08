import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { activityLogService } from "@/services/activityLog";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Log auth events
      if (event === 'SIGNED_IN' && session?.user) {
        activityLogService.log({
          type: 'auth',
          status: 'success',
          title: 'Session Started',
          description: `Signed in as ${session.user.email}`,
        });
      } else if (event === 'SIGNED_OUT') {
        // Already logged in firebase.logout()
      } else if (event === 'PASSWORD_RECOVERY') {
        activityLogService.log({
          type: 'auth',
          status: 'success',
          title: 'Password Recovery',
          description: 'Password recovery flow initiated',
        });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
