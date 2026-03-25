import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SettingsView() {
  const { user, refreshProfile } = useAuth();
  const { saveProfile } = useProfile();
  const [budget, setBudget] = useState(String(user?.dailyBudget || ''));
  const [forestName, setForestName] = useState(user?.forestName || '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile({
        daily_budget: Number(budget),
        forest_name: forestName,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save settings failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-lg">
      <h2 className="font-display text-xl text-foreground mb-6">Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Forest Name</label>
          <Input value={forestName} onChange={e => setForestName(e.target.value)} className="bg-muted border-border" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Daily Budget (₹)</label>
          <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="bg-muted border-border" min={1} />
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
