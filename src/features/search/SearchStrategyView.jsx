import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Target, 
  Users, 
  Clock, 
  TrendingUp,
  Compass,
  ChevronRight,
  Play,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

export default function SearchStrategyView({ caseId }) {
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    loadStrategy();
  }, [caseId]);
  
  const loadStrategy = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/search-strategy/${caseId}`);
      setStrategy(response.data.data);
    } catch (error) {
      console.error('Failed to load strategy:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateStrategy = async () => {
    setGenerating(true);
    try {
      const response = await api.post(`/search-strategy/generate/${caseId}`);
      setStrategy(response.data.data);
      toast.success('Search strategy generated!');
    } catch (error) {
      toast.error('Failed to generate strategy');
    } finally {
      setGenerating(false);
    }
  };
  
  if (!strategy) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Search Strategy</h3>
          <p className="text-gray-500 mb-4">
            Generate an AI-powered search strategy to optimize volunteer efforts
          </p>
          <Button onClick={generateStrategy} disabled={generating}>
            {generating ? 'Generating...' : 'Generate Strategy'}
            {!generating && <Zap className="w-4 h-4 ml-2" />}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Search Strategy
          </h2>
          <p className="text-sm text-gray-500">
            Generated {new Date(strategy.generatedAt).toLocaleString()}
          </p>
        </div>
        <Badge className={`
          ${strategy.priority === 'IMMEDIATE' ? 'bg-red-500' :
            strategy.priority === 'URGENT' ? 'bg-orange-500' :
            strategy.priority === 'HIGH' ? 'bg-yellow-500' : 'bg-blue-500'}
        `}>
          {strategy.priority}
        </Badge>
      </div>
      
      {/* Strategy Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {strategy.zones?.length || 0}
              </div>
              <p className="text-sm text-gray-500">Search Zones</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {strategy.resourceAllocation?.total?.volunteers || 0}
              </div>
              <p className="text-sm text-gray-500">Volunteers Needed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {strategy.areaType}
              </div>
              <p className="text-sm text-gray-500">Area Type</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {strategy.strategy?.baseRadius?.toFixed(1)}km
              </div>
              <p className="text-sm text-gray-500">Search Radius</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Priority Search Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {strategy.zones?.slice(0, 5).map((zone, index) => (
              <div key={zone.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <h4 className="font-medium">
                        Zone {index + 1} ({zone.type})
                      </h4>
                      <p className="text-sm text-gray-500">
                        {zone.radius.toFixed(1)}km radius • {zone.searchMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {zone.probability?.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-500">probability</p>
                  </div>
                </div>
                
                <Progress value={zone.probability} className="h-2 mb-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    👥 {zone.recommendedSearchers} searchers
                  </span>
                  <Button size="sm" variant="outline">
                    Assign <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Search Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {strategy.timeline?.map((phase, index) => (
              <div key={index} className="flex items-start gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${phase.isOverdue ? 'bg-red-500' : 
                      phase.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                  {index < strategy.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{phase.phase}</span>
                    <Badge variant="outline">{phase.hours}h</Badge>
                    {phase.isOverdue && (
                      <Badge variant="destructive">Overdue</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{phase.action}</p>
                  <p className="text-xs text-gray-400">
                    Deadline: {new Date(phase.deadline).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button className="flex-1" onClick={generateStrategy}>
          <Zap className="w-4 h-4 mr-2" />
          Regenerate Strategy
        </Button>
        <Button variant="outline" className="flex-1">
          <Users className="w-4 h-4 mr-2" />
          Assign Volunteers
        </Button>
      </div>
    </div>
  );
}
