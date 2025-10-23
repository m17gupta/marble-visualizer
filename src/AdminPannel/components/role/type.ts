import { Role_permission_Model } from "../permission/type";

export interface RoleModel {
  id?: string; // uuid
  name: string;
  description?: string;
  permission_id?: number[];
  allPermissions?: Role_permission_Model[];
}