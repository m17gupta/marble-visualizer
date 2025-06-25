// /**
//  * Example usage of ProjectAPI
//  * 
//  * This file demonstrates how to use the ProjectAPI for CRUD operations
//  */

// import ProjectAPI, { 
//   ProjectApiResponse, 
//   ProjectListResponse,
//   createProject,
//   updateProject,
//   deleteProject 
// } from './ProjectApi';

// // Example: How to use the ProjectAPI in a component or service

// export class ProjectService {
  
//   // Example: Create a new project
//   static async handleCreateProject(name: string, description?: string, visibility?: 'public' | 'private') {
//     try {
//       const result: ProjectApiResponse = await createProject({
//         name,
//         description,
//         visibility
//       });

//       if (result.success) {
//         console.log('Project created successfully:', result.data);
//         return result.data;
//       } else {
//         console.error('Failed to create project:', result.error);
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Error creating project:', error);
//       throw error;
//     }
//   }

//   // Example: Update an existing project
//   static async handleUpdateProject(projectId: string, updates: {
//     name?: string;
//     description?: string;
//     visibility?: 'public' | 'private';
//   }) {
//     try {
//       const result: ProjectApiResponse = await updateProject(projectId, updates);

//       if (result.success) {
//         console.log('Project updated successfully:', result.data);
//         return result.data;
//       } else {
//         console.error('Failed to update project:', result.error);
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Error updating project:', error);
//       throw error;
//     }
//   }

//   // Example: Delete a project
//   static async handleDeleteProject(projectId: string) {
//     try {
//       const result: ProjectApiResponse = await deleteProject(projectId);

//       if (result.success) {
//         console.log('Project deleted successfully');
//         return true;
//       } else {
//         console.error('Failed to delete project:', result.error);
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       throw error;
//     }
//   }

//   // Example: Get all projects with filters
//   static async handleGetProjects(filters?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     visibility?: 'public' | 'private';
//   }) {
//     try {
//       const result: ProjectListResponse = await ProjectAPI.getAllProjects(filters);

//       if (result.success) {
//         console.log('Projects fetched successfully:', result.data);
//         return {
//           projects: result.data || [],
//           meta: result.meta
//         };
//       } else {
//         console.error('Failed to fetch projects:', result.error);
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       throw error;
//     }
//   }

//   // Example: Search projects
//   static async handleSearchProjects(query: string, filters?: {
//     visibility?: 'public' | 'private';
//     dateFrom?: string;
//     dateTo?: string;
//   }) {
//     try {
//       const result: ProjectListResponse = await ProjectAPI.searchProjects(query, filters);

//       if (result.success) {
//         return result.data || [];
//       } else {
//         console.error('Failed to search projects:', result.error);
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Error searching projects:', error);
//       throw error;
//     }
//   }
// }

// // Example React hook usage (if using in a React component)
// /*
// import { useState, useEffect } from 'react';
// import { ProjectService } from './ProjectService';

// export const useProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchProjects = async (filters?) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await ProjectService.handleGetProjects(filters);
//       setProjects(result.projects);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createProject = async (projectData) => {
//     setLoading(true);
//     try {
//       const newProject = await ProjectService.handleCreateProject(
//         projectData.name,
//         projectData.description,
//         projectData.visibility
//       );
//       setProjects(prev => [...prev, newProject]);
//       return newProject;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProject = async (projectId, updates) => {
//     setLoading(true);
//     try {
//       const updatedProject = await ProjectService.handleUpdateProject(projectId, updates);
//       setProjects(prev => 
//         prev.map(p => p.id === projectId ? updatedProject : p)
//       );
//       return updatedProject;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteProject = async (projectId) => {
//     setLoading(true);
//     try {
//       await ProjectService.handleDeleteProject(projectId);
//       setProjects(prev => prev.filter(p => p.id !== projectId));
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return {
//     projects,
//     loading,
//     error,
//     fetchProjects,
//     createProject,
//     updateProject,
//     deleteProject
//   };
// };
// */
