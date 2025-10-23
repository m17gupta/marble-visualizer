// import React from 'react';
// import DataTable from '../components/shared/DataTable';

// const Team: React.FC = () => {
//   const teamData = [
//     {
//       id: 1,
//       name: 'John Doe',
//       email: 'john.doe@company.com',
//       role: 'Senior Developer',
//       department: 'Engineering',
//       status: 'Active',
//       joinDate: '2023-01-15',
//       projects: 3,
//       lastActive: '2 hours ago',
//       avatar: '👨‍💻'
//     },
//     {
//       id: 2,
//       name: 'Jane Smith',
//       email: 'jane.smith@company.com',
//       role: 'Product Manager',
//       department: 'Product',
//       status: 'Active',
//       joinDate: '2022-08-20',
//       projects: 5,
//       lastActive: '1 hour ago',
//       avatar: '👩‍💼'
//     },
//     {
//       id: 3,
//       name: 'Mike Johnson',
//       email: 'mike.johnson@company.com',
//       role: 'DevOps Engineer',
//       department: 'Engineering',
//       status: 'Away',
//       joinDate: '2023-03-10',
//       projects: 2,
//       lastActive: '1 day ago',
//       avatar: '👨‍🔧'
//     },
//     {
//       id: 4,
//       name: 'Sarah Wilson',
//       email: 'sarah.wilson@company.com',
//       role: 'UI/UX Designer',
//       department: 'Design',
//       status: 'Active',
//       joinDate: '2022-11-05',
//       projects: 4,
//       lastActive: '30 minutes ago',
//       avatar: '👩‍🎨'
//     },
//     {
//       id: 5,
//       name: 'David Brown',
//       email: 'david.brown@company.com',
//       role: 'Security Analyst',
//       department: 'Security',
//       status: 'Inactive',
//       joinDate: '2023-06-01',
//       projects: 1,
//       lastActive: '1 week ago',
//       avatar: '👨‍🔒'
//     }
//   ];

//   const columns = [
//     { 
//       key: 'name', 
//       label: 'Team Member',
//       render: (value: string, row: any) => (
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
//             {row.avatar}
//           </div>
//           <div>
//             <p className="font-medium text-gray-900">{value}</p>
//             <p className="text-sm text-gray-500">{row.email}</p>
//           </div>
//         </div>
//       )
//     },
//     { key: 'role', label: 'Role' },
//     { key: 'department', label: 'Department' },
//     { 
//       key: 'status', 
//       label: 'Status',
//       render: (value: string) => (
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           value === 'Active' ? 'bg-green-100 text-green-800' :
//           value === 'Away' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-red-100 text-red-800'
//         }`}>
//           {value}
//         </span>
//       )
//     },
//     { 
//       key: 'projects', 
//       label: 'Projects',
//       render: (value: number) => `${value} active`
//     },
//     { key: 'joinDate', label: 'Join Date' },
//     { key: 'lastActive', label: 'Last Active' }
//   ];

//   const actions = [
//     {
//       label: 'View Profile',
//       onClick: (row: any) => console.log('View profile:', row),
//       variant: 'primary' as const
//     },
//     {
//       label: 'Edit',
//       onClick: (row: any) => console.log('Edit member:', row),
//       variant: 'secondary' as const
//     },
//     {
//       label: 'Remove',
//       onClick: (row: any) => console.log('Remove member:', row),
//       variant: 'danger' as const
//     }
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* Team Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Members</p>
//               <p className="text-3xl font-bold text-gray-900">47</p>
//             </div>
//             <div className="text-2xl">👥</div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Now</p>
//               <p className="text-3xl font-bold text-green-600">32</p>
//             </div>
//             <div className="text-2xl">🟢</div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">New This Month</p>
//               <p className="text-3xl font-bold text-blue-600">8</p>
//             </div>
//             <div className="text-2xl">✨</div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Departments</p>
//               <p className="text-3xl font-bold text-purple-600">6</p>
//             </div>
//             <div className="text-2xl">🏢</div>
//           </div>
//         </div>
//       </div>

//       {/* Team Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
//           <div className="space-y-4">
//             {[
//               { dept: 'Engineering', count: 18, percentage: 38.3 },
//               { dept: 'Product', count: 8, percentage: 17.0 },
//               { dept: 'Design', count: 7, percentage: 14.9 },
//               { dept: 'Marketing', count: 6, percentage: 12.8 },
//               { dept: 'Sales', count: 5, percentage: 10.6 },
//               { dept: 'Security', count: 3, percentage: 6.4 }
//             ].map((item, index) => (
//               <div key={index} className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-700">{item.dept}</span>
//                   <span className="font-medium text-gray-900">{item.count} ({item.percentage}%)</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-600 h-2 rounded-full" 
//                     style={{ width: `${item.percentage}%` }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h3>
//           <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
//             <div className="text-center">
//               <div className="text-3xl mb-2">📊</div>
//               <p className="text-gray-600 font-medium">Activity Timeline</p>
//               <p className="text-sm text-gray-500">Team activity over time</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Team Members Table */}
//       <DataTable
//         title="Team Members"
//         columns={columns}
//         data={teamData}
//         actions={actions}
//         searchable={true}
//         pagination={true}
//       />

//       {/* Additional Team Info */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Joiners</h4>
//           <div className="space-y-4">
//             {[
//               { name: 'Alex Thompson', role: 'Frontend Developer', joinDate: '3 days ago' },
//               { name: 'Maria Garcia', role: 'Product Designer', joinDate: '1 week ago' },
//               { name: 'James Wilson', role: 'DevOps Engineer', joinDate: '2 weeks ago' },
//               { name: 'Lisa Chen', role: 'Data Analyst', joinDate: '3 weeks ago' }
//             ].map((member, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{member.name}</p>
//                   <p className="text-xs text-gray-500">{member.role}</p>
//                 </div>
//                 <span className="text-xs text-gray-500">{member.joinDate}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performers</h4>
//           <div className="space-y-4">
//             {[
//               { name: 'Sarah Wilson', metric: 'Projects Completed', value: '12' },
//               { name: 'John Doe', metric: 'Code Reviews', value: '89' },
//               { name: 'Jane Smith', metric: 'Team Collaboration', value: '95%' },
//               { name: 'Mike Johnson', metric: 'System Uptime', value: '99.9%' }
//             ].map((performer, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{performer.name}</p>
//                   <p className="text-xs text-gray-500">{performer.metric}</p>
//                 </div>
//                 <span className="text-sm font-bold text-blue-600">{performer.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Team;