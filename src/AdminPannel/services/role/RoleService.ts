import { RoleModel } from "@/AdminPannel/components/role/type";
import { RoleApi } from "./RoleApi";
import { RolePermissionApi } from "./RolePermissionApi";


export class RoleService {
  static async getRoles() {
    return RoleApi.getRoles();
  }

  static async createRole(role: RoleModel) {
    return RoleApi.createRole(role);
  }

  static async updateRole(role: RoleModel) {
    return RoleApi.updateRole(role);
  }

  static async deleteRole(id: string) {
    return RoleApi.deleteRole(id);
  }

// getAll role permissions
  static async getAllRolePermissions() {
    return RolePermissionApi.getRolePermissions();
  }

  // add role permission
  static async addRolePermission(permission: any) {
    return RolePermissionApi.createRolePermission(permission);
  }
    // update role permission
  static async updateRolePermission(permission: any) {
    return RolePermissionApi.updateRolePermission(permission);
  }

    // delete role permission
  static async deleteRolePermission(id: number) {
    return RolePermissionApi.deleteRolePermission(id);
  }

}
