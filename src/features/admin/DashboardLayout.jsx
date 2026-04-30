import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Activity,
  Bell,
  Search,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, 
  BarChart, 
  PieChart as RePieChart, 
  AreaChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  Area,
  Bar,
  Line
} from 'recharts';
import { toast } from 'sonner';
import api from '@/services/api';
import { useSocket } from '@/hooks/useSocket';
import { integrationService } from '@/services/integrationService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardLayout() {
  const [stats, setStats] = useState(null);
  const [realtimeData, setRealtimeData] = useState([]);
  const [activeCases, setActiveCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [schoolNetworkStats, setSchoolNetworkStats] = useState(null);
  const [predictionPreview, setPredictionPreview] = useState(null);
  const [monitoringHealth, setMonitoringHealth] = useState(null);
  const { socket, isConnected } = useSocket();
  
  useEffect(() => {
    loadDashboardData();
    
    if (socket) {
      socket.on('case-created', handleNewCase);
      socket.on('sighting-added', handleNewSighting);
      socket.on('case-resolved', handleCaseResolved);
    }
    
    return () => {
      if (socket) {
        socket.off('case-created');
        socket.off('sighting-added');
        socket.off('case-resolved');
      }
    };
  }, [socket, timeRange]);
  
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, casesRes, analyticsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/cases', { params: { status: 'active', limit: 10 } }),
        api.get('/dashboard/analytics', { params: { range: timeRange } })
      ]);
      
      setStats(statsRes.data.data);
      setActiveCases(casesRes.data.data);
      setRealtimeData(analyticsRes.data.data);

      const [languagesRes, schoolStatsRes, monitoringRes] =
        await Promise.allSettled([
          integrationService.getSupportedLanguages(),
          integrationService.getSchoolNetworkStats(),
          integrationService.getMonitoringHealth(),
        ]);

      if (languagesRes.status === 'fulfilled') {
        setSupportedLanguages(languagesRes.value.data || []);
      }
      if (schoolStatsRes.status === 'fulfilled') {
        setSchoolNetworkStats(schoolStatsRes.value.data || null);
      }
      if (monitoringRes.status === 'fulfilled') {
        setMonitoringHealth(monitoringRes.value.data || null);
      }

      if (casesRes.data.data?.length) {
        const predictionRes = await integrationService.predictCaseOutcome(
          casesRes.data.data[0],
        );
        setPredictionPreview(predictionRes.data || null);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewCase = (data) => {
    toast.success('New case reported', {
      description: data.summary,
      action: { label: 'View', onClick: () => window.location.href = `/case/${data.caseId}` }
    });
    loadDashboardData();
  };
  
  const handleNewSighting = (data) => {
    toast.info('New sighting reported', {
      description: `Case ${data.caseId}: ${data.description}`
    });
  };
  
  const handleCaseResolved = (data) => {
    toast.success('Case resolved!', {
      description: `${data.personName} has been found`
    });
    loadDashboardData();
  };
  
  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div variants={itemVariants}>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
              {change && (
                <div className="flex items-center gap-1 mt-2">
                  {change > 0 ? (
                    <ArrowUp className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-rose-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    change > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-gray-400">vs last {timeRange}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-gray-50`}>
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280', '#8B5CF6', '#EC4899'];
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
            <p className="text-gray-500 mt-1">Real-time intelligence and search coordination</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isConnected ? 'default' : 'secondary'} className="gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {isConnected ? 'Live' : 'Offline'}
            </Badge>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Cases"
            value={stats?.activeCases || 0}
            change={stats?.activeCasesChange}
            icon={Activity}
          />
          <StatCard
            title="Volunteers Online"
            value={stats?.onlineVolunteers || 0}
            change={stats?.volunteersChange}
            icon={Users}
          />
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate || 0}%`}
            change={stats?.successRateChange}
            icon={CheckCircle}
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats?.avgResponseTime || 0}m`}
            change={stats?.responseTimeChange}
            icon={Clock}
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cases Trend */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  Cases Trend
                </CardTitle>
                <div className="flex gap-1">
                  {['24h', '7d', '30d'].map(range => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className="h-7 text-xs"
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={realtimeData?.trend || []}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reported" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCases)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#6B7280" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorResolved)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Priority Distribution */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-gray-600" />
                  Priority Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={stats?.priorityDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats?.priorityDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Active Cases & Real-time Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cases List */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  Active Cases
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-2">
                    {activeCases.map((caseItem, index) => (
                      <motion.div
                        key={caseItem.caseId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/case/${caseItem.caseId}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {caseItem.person?.name || 'Unknown'}
                              {caseItem.person?.age && (
                                <span className="text-gray-500 ml-2 text-sm">
                                  {caseItem.person.age} years
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {caseItem.lastSeen?.address || 'Unknown location'}
                            </p>
                          </div>
                          <Badge className={`
                            ${caseItem.priority?.level === 'HIGH' ? 'bg-rose-500' : 
                              caseItem.priority?.level === 'MEDIUM' ? 'bg-amber-500' : 
                              'bg-emerald-500'}
                          `}>
                            {caseItem.priority?.level}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {caseItem.timeAgo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {caseItem.assignedVolunteers?.length || 0} volunteers
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {caseItem.sightings?.length || 0} sightings
                          </span>
                        </div>
                        
                        {caseItem.aiData?.summary && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {caseItem.aiData.summary}
                          </p>
                        )}
                        
                        <div className="mt-3">
                          <Progress 
                            value={caseItem.searchProgress || 0} 
                            className="h-1.5" 
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Real-time Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-3">
                    {realtimeData?.activities?.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                          ${activity.type === 'case_created' ? 'bg-emerald-100' :
                            activity.type === 'sighting' ? 'bg-amber-100' :
                            activity.type === 'volunteer' ? 'bg-gray-100' :
                            'bg-rose-100'}
                        `}>
                          {activity.type === 'case_created' && <AlertTriangle className="w-4 h-4 text-emerald-700" />}
                          {activity.type === 'sighting' && <Eye className="w-4 h-4 text-amber-700" />}
                          {activity.type === 'volunteer' && <Users className="w-4 h-4 text-gray-700" />}
                          {activity.type === 'resolved' && <CheckCircle className="w-4 h-4 text-rose-700" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Bottom Stats */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalSearches || 0}</p>
                  <p className="text-xs text-gray-500">Total Searches</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.volunteerHours || 0}h</p>
                  <p className="text-xs text-gray-500">Volunteer Hours</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.aiConfidence || 0}%</p>
                  <p className="text-xs text-gray-500">Avg AI Confidence</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.coverageArea || 0}km²</p>
                  <p className="text-xs text-gray-500">Area Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integration Readiness */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Integrations and AI Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Supported Languages</p>
                  <p className="mt-1 text-sm font-medium">
                    {(supportedLanguages || []).join(', ') || 'Not available'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Alert Health</p>
                  <p className="mt-1 text-sm font-medium">
                    {monitoringHealth?.overall || 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">School Networks</p>
                  <p className="mt-1 text-sm font-medium">
                    {schoolNetworkStats?.totalNetworks ?? 0} networks
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Prediction Preview</p>
                  <p className="mt-1 text-sm font-medium">
                    {predictionPreview?.prediction || 'Not available'}
                    {predictionPreview?.score ? ` (${predictionPreview.score}/100)` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
