import { GTablePermission } from "./GPermission";

export interface GSchemaPermission {
  pesquema: string;
  tablas: GTablePermission[];
}
