import { supabase } from "@/lib/supabase";
import { Role_permission_Model } from "@/AdminPannel/components/permission/type";


export class RolePermissionApi {
  static async getRolePermissions() {

   try{
    const { data, error } = await supabase.from("role_permissions").select("*");
    if (error) throw error;
    return data;    
   } catch (error) {
     console.error("Error fetching role permissions:", error);
     throw error;
   }
  }

  static async createRolePermission(permission: Role_permission_Model) {
    try {
      const { data, error } = await supabase.from("role_permissions").insert(permission);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating role permission:", error);
      throw error;
    }
  }

  //update role permission
  static async updateRolePermission(permission: Role_permission_Model) {
    try {
      const { data, error } = await supabase.from("role_permissions").update(permission).match({ id: permission.id });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating role permission:", error);
      throw error;
    }
  }

  //delete role permission
  static async deleteRolePermission(id: number) {
    try {
      const { data, error } = await supabase.from("role_permissions").delete().match({ id });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting role permission:", error);
      throw error;
    }
  }
 } 