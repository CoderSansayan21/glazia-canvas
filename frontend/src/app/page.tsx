'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { canvasApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CanvasListItem from '@/components/CanvasListItem';
import { CanvasData } from '@/types/canvas';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    canvasApi
      .getAll()
      .then((res) => setCanvases(res.data.canvases))
      .catch((err) => {
        console.error(err);
        setError('Failed to load canvases.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this canvas? This cannot be undone.')) return;
    try {
      await canvasApi.delete(id);
      setCanvases((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Glazia Mini Design Canvas</h1>

        {/* [BONUS: Auth] show login state */}
        <div className="flex items-center gap-3 text-sm">
          {authLoading ? null : user ? (
            <>
              <span className="text-gray-500">Hi, {user.username}</span>
              <button onClick={logout} className="text-red-500 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')} className="text-indigo-600 hover:underline">
                Login
              </button>
              <button onClick={() => router.push('/signup')} className="text-indigo-600 hover:underline">
                Signup
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Canvases</h2>
          <button
            onClick={() => router.push('/editor/new')}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            + New Canvas
          </button>
        </div>

        {loading && <p className="text-gray-400 text-sm">Loading…</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && canvases.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No canvases yet. Click "New Canvas" to get started.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {canvases.map((canvas) => (
            <CanvasListItem
              key={canvas._id}
              canvas={canvas}
              onOpen={() => router.push(`/editor/${canvas._id}`)}
              onDelete={() => handleDelete(canvas._id!)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}