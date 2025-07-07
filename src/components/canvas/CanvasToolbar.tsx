import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CanvasToolbarProps {
  children: React.ReactNode;
}

export default function CanvasToolbar({ children }: CanvasToolbarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
