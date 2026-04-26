import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }) {
  const { isAdminLoggedIn, isCheckingSession } = useAdminAuth();

  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
