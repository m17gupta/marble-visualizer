import React from 'react';
import DataTable from '../components/shared/DataTable';

const Projects: React.FC = () => {
  const projectsData = [
    {
      id: 1,
      name: 'E-commerce Platform',
      status: 'Active',
      owner: 'John Doe',
      team: 8,
      progress: 85,
      budget: '$125,000',
      deadline: '2024-12-15',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      status: 'In Progress',
      owner: 'Jane Smith',
      team: 5,
      progress: 62,
      budget: '$75,000',
      deadline: '2024-11-30',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'API Integration',
      status: 'Completed',
      owner: 'Mike Johnson',
      team: 3,
      progress: 100,
      budget: '$45,000',
      deadline: '2024-10-20',
      lastActivity: '1 week ago'
    },
    {
      id: 4,
      name: 'Database Migration',
      status: 'Pending',
      owner: 'Sarah Wilson',
      team: 4,
      progress: 15,
      budget: '$60,000',
      deadline: '2025-01-15',
      lastActivity: '3 days ago'
    },
    {
      id: 5,
      name: 'Security Audit',
      status: 'On Hold',
      owner: 'David Brown',
      team: 2,
      progress: 40,
      budget: '$30,000',
      deadline: '2024-12-01',
      lastActivity: '5 days ago'
    }
  ];

  const columns = [
    { key: 'name', label: 'Project Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          value === 'Completed' ? 'bg-gray-100 text-gray-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'owner', label: 'Project Owner' },
    { 
      key: 'team', 
      label: 'Team Size',
      render: (value: number) => `${value} members`
    },
    { 
      key: 'progress', 
      label: 'Progress',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    { key: 'budget', label: 'Budget' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'lastActivity', label: 'Last Activity' }
  ];

  const actions = [
    {
      label: 'View',
      onClick: (row: any) => console.log('View project:', row),
      variant: 'primary' as const
    },
    {
      label: 'Edit',
      onClick: (row: any) => console.log('Edit project:', row),
      variant: 'secondary' as const
    },
    {
      label: 'Delete',
      onClick: (row: any) => console.log('Delete project:', row),
      variant: 'danger' as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="text-2xl">📁</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <div className="text-2xl">🚀</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Hold</p>
              <p className="text-3xl font-bold text-yellow-600">3</p>
            </div>
            <div className="text-2xl">⏸️</div>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <div className="h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-gray-600 font-medium">Project Timeline Chart</p>
            <p className="text-sm text-gray-500">Gantt chart showing project schedules</p>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <DataTable
        title="All Projects"
        columns={columns}
        data={projectsData}
        actions={actions}
        searchable={true}
        pagination={true}
      />

      {/* Project Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Projects by Category</h4>
          <div className="space-y-4">
            {[
              { category: 'Web Development', count: 8, color: 'bg-blue-500' },
              { category: 'Mobile Apps', count: 5, color: 'bg-green-500' },
              { category: 'API Development', count: 4, color: 'bg-purple-500' },
              { category: 'Infrastructure', count: 3, color: 'bg-orange-500' },
              { category: 'Design', count: 4, color: 'bg-pink-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Activities</h4>
          <div className="space-y-4">
            {[
              { action: 'Project created', project: 'E-commerce Platform', time: '2 hours ago' },
              { action: 'Milestone completed', project: 'Mobile App Redesign', time: '1 day ago' },
              { action: 'Team member added', project: 'API Integration', time: '2 days ago' },
              { action: 'Budget updated', project: 'Database Migration', time: '3 days ago' },
              { action: 'Status changed', project: 'Security Audit', time: '5 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.project} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;