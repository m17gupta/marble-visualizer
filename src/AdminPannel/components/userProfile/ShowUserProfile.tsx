import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const ShowUserProfile = () => {
  const { allUserProfiles, profile, isLoading } = useSelector(
    (state: RootState) => state.userProfile
  );

 

  const dispatch = useDispatch<AppDispatch>();

  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedProfiles = useMemo(() => {
    if (allUserProfiles !== undefined) {
      let filtered = allUserProfiles.filter((profile) => {
        const matchesSearch =
          profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && profile.status) ||
          (statusFilter === "inactive" && !profile.status);

        return matchesSearch && matchesStatus;
      });
      if (sortField) {
        filtered.sort((a: any, b: any) => {
          let aVal = a[sortField];
          let bVal = b[sortField];

          if (aVal === null || aVal === undefined) aVal = "";
          if (bVal === null || bVal === undefined) bVal = "";

          if (typeof aVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
          if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    }
  }, [allUserProfiles, sortField, sortDirection, searchTerm, statusFilter]);

  const SortIcon = ({ field }: any) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (!allUserProfiles || allUserProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium mb-2">No user profiles found</h3>
        <p className="text-sm">
          Get started by adding your first user profile.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">User Profiles</h2>
          <div className="text-sm text-gray-500">
            {filteredAndSortedProfiles !== undefined &&
              filteredAndSortedProfiles.length}{" "}
            of {allUserProfiles.length} users
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("user_id")}
              >
                <div className="flex items-center space-x-1">
                  <span>User ID</span>
                  <SortIcon field="user_id" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("full_name")}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  <SortIcon field="full_name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  <SortIcon field="role" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Materials
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedProfiles !== undefined &&
              filteredAndSortedProfiles.map((profile, index) => (
                <tr
                  key={profile.id || profile.user_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {profile.user_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {profile.email || <span className="text-gray-400">N/A</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {profile.profile_image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={profile.profile_image}
                            alt={profile.full_name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">
                              {profile.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.full_name}
                        </div>
                        <div className="text-sm text-gray-500 font-mono">
                          ID: {profile.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : profile.role === "moderator"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profile.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {profile.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.subscription_id ? (
                      <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {profile.subscription_id}
                      </span>
                    ) : (
                      <span className="text-gray-400">No subscription</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.created_at || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {profile.favorite_materials &&
                    profile.favorite_materials.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {profile.favorite_materials
                          .slice(0, 2)
                          .map((material, i) => (
                            <span
                              key={i}
                              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {material}
                            </span>
                          ))}
                        {profile.favorite_materials.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{profile.favorite_materials.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                        title="Edit Profile"
                        onClick={() => alert(`Edit user ${profile.user_id}`)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete Profile"
                        onClick={() => alert(`Delete user ${profile.user_id}`)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing{" "}
            {filteredAndSortedProfiles && filteredAndSortedProfiles.length} of{" "}
            {allUserProfiles.length} results
          </span>
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-xs">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserProfile;

// import {
//   getAllUserFileProfiles,
//   selectProfile,
//   setProfile,
// } from "@/redux/slices/user/userProfileSlice";
// import { AppDispatch, RootState } from "@/redux/store";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const ShowUserProfile = () => {
//   const { allUserProfiles, profile, isLoading } = useSelector(
//     (state: RootState) => state.userProfile
//   );

//   const dispatch = useDispatch<AppDispatch>();

//   return (
//     <>
//       {/* show user profile in table */}
//       {allUserProfiles && allUserProfiles.length === 0 ? (
//         <div>No user profiles found.</div>
//       ) : (
//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               minWidth: 900,
//               fontSize: 15,
//             }}
//           >
//             <thead>
//               <tr style={{ background: "#f3f4f6" }}>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   S No.
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   ID
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   User ID
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Full Name
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Role
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Profile Image
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Subscription ID
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Session ID
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Status
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Created At
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Updated At
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Favorite Materials
//                 </th>
//                 <th
//                   style={{
//                     border: "1px solid #e5e7eb",
//                     padding: "8px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {(allUserProfiles || []).map((profile, index) => (
//                 <tr
//                   key={profile.id || profile.user_id}
//                   style={{
//                     borderBottom: "1px solid #e5e7eb",
//                     background: index % 2 === 0 ? "#fff" : "#f9fafb",
//                     transition: "background 0.2s",
//                   }}
//                 >
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {index + 1}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {profile.id}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textAlign: "center",
//                       fontFamily: "monospace",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.user_id}
//                   </td>
//                   <td style={{ border: "1px solid #e5e7eb", padding: "8px" }}>
//                     {profile.full_name}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textTransform: "capitalize",
//                       textAlign: "center",
//                     }}
//                   >
//                     {profile.role}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {profile.profile_image ? (
//                       <img
//                         src={profile.profile_image}
//                         alt="Profile"
//                         style={{
//                           width: 36,
//                           height: 36,
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                           border: "1px solid #ddd",
//                         }}
//                       />
//                     ) : (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       fontFamily: "monospace",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.subscription_id || (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       fontFamily: "monospace",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.session_id || (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     <span
//                       style={{
//                         color: profile.status ? "#16a34a" : "#dc2626",
//                         fontWeight: 600,
//                       }}
//                     >
//                       {profile.status ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.created_at || (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.updated_at || (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       fontSize: 13,
//                     }}
//                   >
//                     {profile.favorite_materials &&
//                     profile.favorite_materials.length > 0 ? (
//                       profile.favorite_materials.join(", ")
//                     ) : (
//                       <span style={{ color: "#aaa" }}>N/A</span>
//                     )}
//                   </td>
//                   <td className="flex flex-col items-center h-full gap-1">
//                     <button
//                       style={{
//                         marginRight: 8,
//                         background: "#f3f4f6",
//                         border: "none",
//                         borderRadius: 4,
//                         padding: "4px 12px",
//                         cursor: "pointer",
//                         color: "#2563eb",
//                         fontWeight: 500,
//                       }}
//                       // onClick={() => dispatch(setProfile(profile))}
//                     >
//                       View
//                     </button>
//                     <button
//                       style={{
//                         marginRight: 8,
//                         background: "#f3f4f6",
//                         border: "none",
//                         borderRadius: 4,
//                         padding: "4px 12px",
//                         cursor: "pointer",
//                         color: "#2563eb",
//                         fontWeight: 500,
//                       }}
//                       onClick={() => alert(`Edit user ${profile.user_id}`)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       style={{
//                         background: "#fef2f2",
//                         border: "none",
//                         borderRadius: 4,
//                         padding: "4px 12px",
//                         cursor: "pointer",
//                         color: "#dc2626",
//                         fontWeight: 500,
//                       }}
//                       onClick={() => alert(`Delete user ${profile.user_id}`)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   );
// };

// export default ShowUserProfile;
