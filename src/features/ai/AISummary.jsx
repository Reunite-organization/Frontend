import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AISummary({ summary, loading, confidence }) {
  if (loading) {
    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">AI is analyzing...</span>
        </div>
      </Card>
    );
  }
  
  if (!summary) return null;
  
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-blue-900">AI Summary</h4>
            {confidence && (
              <Badge variant="outline" className="text-xs">
                {confidence}% confidence
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      </div>
    </Card>
  );
}
