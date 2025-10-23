import { Role_permission_Model } from "@/AdminPannel/components/permission/type";
import { RoleModel } from "@/AdminPannel/components/role/type";
import { supabase } from "@/lib/supabase";
import { all } from "axios";

export const RoleApi = {
  getRoles: async () => {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) throw error;
    if (data && Array.isArray(data)) {
      // Collect all unique permission ids from all roles
      const permissionIds = Array.from(new Set(data.flatMap(role => Array.isArray(role.permission_id) ? role.permission_id : [])));
      // Fetch all permissions in a single query
      let allPermissions: Role_permission_Model[] = [];
      if (permissionIds.length > 0) {
        const { data: permissionsData, error: permError } = await supabase
          .from("role_permissions")
          .select("*")
          .in('id', permissionIds);
        if (permError) throw permError;
        allPermissions = permissionsData || [];
      }
      // Map permissions to each role
      return data.map(role => {
        const permissionIdArr = Array.isArray(role.permission_id) ? role.permission_id : [];
        const rolePermissions = allPermissions.filter(p => permissionIdArr.includes(p.id));
        return { ...role, allPermissions: rolePermissions };
      });
    }
    return data;
  }
  ,
  createRole: async (role: RoleModel) => {
    const { data, error } = await supabase.from("roles").insert(role);
    if (error) throw error;
    return data;
  },
  updateRole: async (role: RoleModel) => {
    const { data, error } = await supabase.from("roles").update(role).match({ id: role.id });
    if (error) throw error;
    return data;
  },
  deleteRole: async (id: string) => {
    const { data, error } = await supabase.from("roles").delete().match({ id });
    if (error) throw error;
    return data;
  },
};
