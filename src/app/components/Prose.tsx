// /app/components/Prose.tsx
import React from 'react';

export const Prose: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="prose">{children}</div>;
};