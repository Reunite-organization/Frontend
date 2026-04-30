import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

export default function ConfidenceBadge({ score, showIcon = true, size = 'default' }) {
  const getConfidenceLevel = (score) => {
    if (score >= 80) return { label: 'High', color: 'bg-green-500', icon: ShieldCheck };
    if (score >= 60) return { label: 'Medium', color: 'bg-yellow-500', icon: Shield };
    if (score >= 40) return { label: 'Low', color: 'bg-orange-500', icon: ShieldAlert };
    return { label: 'Very Low', color: 'bg-red-500', icon: ShieldX };
  };
  
  const level = getConfidenceLevel(score);
  const Icon = level.icon;
  
  return (
    <Badge className={`${level.color} text-white gap-1`}>
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{level.label}</span>
      <span className="ml-1 opacity-90">({Math.round(score)}%)</span>
    </Badge>
  );
}
