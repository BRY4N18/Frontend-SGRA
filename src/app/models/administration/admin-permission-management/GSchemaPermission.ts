import { GTablePermission } from "./GPermission";

export interface GSchemaPermission {
  schemaName: string;
  tables: GTablePermission[];
}
