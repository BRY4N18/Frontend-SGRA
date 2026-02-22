export interface GCatalogRecord {
  mid: number;
  mnombre: string;
  mestado: 'activo' | 'inactivo';
}

export interface GCatalogRecordCUD {
  esquematabla: string;
  id?: number;
  nombre: string
  estado: boolean;
}
