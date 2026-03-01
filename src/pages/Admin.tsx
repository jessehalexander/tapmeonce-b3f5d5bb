// ─────────────────────────────────────────────
// TapMeOnce — Admin Panel
// Owner-only dashboard to manage all users, orders, teams
// Access via jesseh.alexander@gmail.com login
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, CreditCard, BarChart2, Settings, LogOut, Search,
  ChevronRight, RefreshCw, Shield, Loader2, ExternalLink,
  Download, Bell, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PLANS } from '@/lib/plans';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'users' | 'orders' | 'analytics';

export default function Admin() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, free: 0, pro: 0, biz: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/dashboard'); toast.error('Admin access only'); return; }
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    const [usersRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    const usersData = usersRes.data || [];
    const ordersData = ordersRes.data || [];
    setUsers(usersData);
    setOrders(ordersData);
    setStats({
      total: usersData.length,
      free: usersData.filter(u => u.plan === 'free').length,
      pro: usersData.filter(u => u.plan === 'professional').length,
      biz: usersData.filter(u => u.plan === 'business').length,
      revenue: ordersData.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0),
    });
    setLoading(false);
  };

  const toggleUserActive = async (userId: string, current: boolean) => {
    await supabase.from('profiles').update({ is_active: !current }).eq('user_id', userId);
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_active: !current } : u));
    toast.success(`User ${!current ? 'activated' : 'deactivated'}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredUsers = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: BarChart2 },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'orders' as AdminTab, label: 'Orders', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex flex-col w-52 border-r border-border shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-gradient-gold">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                tab === t.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <a href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60">
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur px-4 h-14 flex items-center justify-between">
          <h2 className="text-sm font-semibold capitalize">{tab}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-5xl">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold">Welcome, Admin</h1>
                <p className="text-muted-foreground text-sm mt-1">Overview of all TapMeOnce accounts.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Users', value: stats.total, color: 'text-foreground' },
                  { label: 'Free', value: stats.free, color: 'text-muted-foreground' },
                  { label: 'Professional', value: stats.pro, color: 'text-primary' },
                  { label: 'Business', value: stats.biz, color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="glass-card rounded-xl p-4">
                    <p className={cn('font-display text-2xl font-bold', s.color)}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="font-display text-3xl font-bold text-primary">₹{stats.revenue.toLocaleString('en-IN')}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Recent signups</p>
                <div className="space-y-2">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u.full_name?.[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-xs',
                        u.plan === 'business' ? 'text-amber-400 border-amber-500/30' :
                        u.plan === 'professional' ? 'text-primary border-primary/30' :
                        'text-muted-foreground'
                      )}>
                        {u.plan}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-xl font-bold">Users ({users.length})</h1>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  const csv = ['Name,Email,Username,Plan,Active,Joined'].concat(
                    users.map(u => `${u.full_name},${u.email},${u.username},${u.plan},${u.is_active},${u.created_at}`)
                  ).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'tapmeonce-users.csv'; a.click();
                }} className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, username…"
                  className="pl-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <div key={u.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {u.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{u.full_name}</p>
                        <Badge variant="outline" className={cn('text-xs',
                          u.plan === 'business' ? 'text-amber-400 border-amber-500/30' :
                          u.plan === 'professional' ? 'text-primary border-primary/30' :
                          'text-muted-foreground'
                        )}>
                          {u.plan}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{u.email} · @{u.username}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`/p/${u.username}`} target="_blank" className="p-1 rounded hover:bg-secondary">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                      <Switch
                        checked={u.is_active}
                        onCheckedChange={() => toggleUserActive(u.user_id, u.is_active)}
                        className="scale-75"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              <h1 className="font-display text-xl font-bold">Orders ({orders.length})</h1>
              <div className="space-y-2">
                {orders.map(o => (
                  <div key={o.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order #{o.id.slice(-8)}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {o.plan} plan · {o.card_type?.replace('_', ' ')} · {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{o.total_amount}</p>
                      <Badge variant="outline" className="text-xs capitalize mt-0.5">{o.status?.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">No orders yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
