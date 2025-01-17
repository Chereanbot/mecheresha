import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { 
  Briefcase, Clock, AlertTriangle, CheckCircle, 
  Calendar, MessageSquare, Star, TrendingUp, Users,
  FileText, DollarSign, Bell, Scale, BookOpen,
  Timer, GitPullRequest, Search, Filter, MoreVertical,
  PlusCircle, Download, Share2, Printer, Settings,
  ChevronDown, Upload
} from 'lucide-react';
import { DashboardAlerts } from '@/components/lawyer/dashboard/DashboardAlerts';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getLawyerDashboardData(lawyerId: string) {
  return await prisma.user.findUnique({
    where: {
      id: lawyerId,
    },
    include: {
      lawyerProfile: {
        include: {
          office: true,
          performance: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      },
      assignedCases: {
        where: {
          OR: [
            { status: 'ACTIVE' },
            { status: 'PENDING' }
          ]
        },
        include: {
          client: true,
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          documents: {
            orderBy: { uploadedAt: 'desc' },
            take: 5
          },
          notes: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      },
      appeals: {
        where: { status: 'PENDING' },
        include: {
          case: true,
          hearings: {
            where: {
              scheduledDate: {
                gte: new Date()
              }
            },
            orderBy: { scheduledDate: 'asc' }
          }
        }
      },
      assignedServices: {
        include: {
          client: true,
          Appointment: {
            where: {
              scheduledFor: { gte: new Date() }
            },
            orderBy: { scheduledFor: 'asc' },
            take: 5
          },
          communications: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      },
      notifications: {
        where: { status: 'UNREAD' },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      documents: {
        orderBy: { uploadedAt: 'desc' },
        take: 5
      }
    }
  });
}

export default async function LawyerDashboard() {
  const headersList = await headers();
  const lawyerId = headersList.get('x-lawyer-id');

  if (!lawyerId) {
    console.error('No lawyer ID found in headers');
    return <div>Error: Unable to load lawyer data</div>;
  }

  try {
    const dashboardData = await getLawyerDashboardData(lawyerId);

    if (!dashboardData || !dashboardData.lawyerProfile) {
      console.error('No lawyer data found for ID:', lawyerId);
      return <div>Error: Unable to load lawyer profile</div>;
    }

    const activeCases = dashboardData.assignedCases.filter(c => c.status === 'ACTIVE');
    const pendingCases = dashboardData.assignedCases.filter(c => c.status === 'PENDING');
    const upcomingHearings = dashboardData.appeals.flatMap(a => a.hearings);
    const pendingAppeals = dashboardData.appeals.length;
    const totalDocuments = dashboardData.documents.length;
    const unreadMessages = dashboardData.assignedServices
      .flatMap(s => s.communications)
      .filter(c => c.status === 'UNREAD');
    const upcomingAppointments = dashboardData.assignedServices
      .flatMap(s => s.Appointment)
      .filter(a => a && new Date(a.scheduledFor) > new Date());
    const recentPayments = dashboardData.assignedServices
      .flatMap(s => s.payments)
      .filter(p => p.status === 'COMPLETED');

    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome Back, {dashboardData.fullName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Here's what's happening with your cases today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center max-w-md flex-1">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search cases, documents, or clients..." 
                      className="pl-10 w-full bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                </div>
                
                {/* Quick Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      New Case
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Hearing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {dashboardData.notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                          {dashboardData.notifications.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {dashboardData.notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-sm text-gray-500">{notification.message}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Secondary Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Today's Tasks</span>
                  <span className="text-lg font-bold">{upcomingHearings.length}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Unread Messages</span>
                  <span className="text-lg font-bold">{unreadMessages.length}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Pending Reviews</span>
                  <span className="text-lg font-bold">{pendingCases.length}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Documents</span>
                  <span className="text-lg font-bold">{totalDocuments}</span>
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="mb-6">
              <DashboardAlerts 
                lawyerCreatedAt={dashboardData.lawyerProfile.createdAt}
                appointments={upcomingAppointments}
                messages={unreadMessages}
                notifications={dashboardData.notifications}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-105 transform duration-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl shadow-inner">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Cases</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeCases.length}</h3>
                      <div className="mt-2">
                        <Progress value={70} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-12 -mt-12"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl shadow-inner">
                      <Scale className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Appeals</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pendingAppeals}</h3>
                      <div className="mt-1">
                        <Progress value={45} className="h-1 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl shadow-inner">
                      <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Rating</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData.lawyerProfile.rating?.toFixed(1) || 'N/A'}
                      </h3>
                      <div className="mt-1">
                        <Progress value={85} className="h-1 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-12 -mt-12"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl shadow-inner">
                      <Timer className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Case Load</p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.lawyerProfile.caseLoad}</h3>
                      <div className="mt-1">
                        <Progress value={60} className="h-1 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activities Section - Spans 2 columns on large screens */}
              <Card className="lg:col-span-2 transition-all hover:shadow-lg">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                    <GitPullRequest className="mr-2 h-5 w-5 text-blue-500" />
                    Recent Case Activities
                  </h2>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {dashboardData.activities.map(activity => (
                        <div key={activity.id} 
                          className="relative pl-4 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500" />
                          <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                          {activity.details && (
                            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                              {JSON.stringify(activity.details)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </Card>

              {/* Upcoming Hearings - Right sidebar */}
              <div className="space-y-6">
                <Card className="transition-all hover:shadow-lg">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                      <Calendar className="mr-2 h-5 w-5 text-green-500" />
                      Upcoming Hearings
                    </h2>
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="space-y-4">
                        {upcomingHearings.map(hearing => (
                          <div key={hearing.id} 
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{hearing.location}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(hearing.scheduledDate).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant={hearing.status === 'SCHEDULED' ? 'default' : 'secondary'}>
                              {hearing.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </Card>

                <Card className="transition-all hover:shadow-lg">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                      <FileText className="mr-2 h-5 w-5 text-purple-500" />
                      Recent Documents
                    </h2>
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="space-y-4">
                        {dashboardData.documents.map(doc => (
                          <div key={doc.id} 
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{doc.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline">{doc.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial Summary */}
              <Card className="lg:col-span-2 transition-all hover:shadow-lg">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                    <DollarSign className="mr-2 h-5 w-5 text-emerald-500" />
                    Financial Summary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentPayments.map(payment => (
                      <div key={payment.id} 
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${payment.amount.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {payment.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Legal Research */}
              <Card className="transition-all hover:shadow-lg">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                    <BookOpen className="mr-2 h-5 w-5 text-indigo-500" />
                    Legal Research
                  </h2>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Recent legal research and resources will appear here
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Action Floating Button */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <div className="p-6">
        <div className="text-red-500">Error: Something went wrong loading the dashboard</div>
      </div>
    );
  }
}