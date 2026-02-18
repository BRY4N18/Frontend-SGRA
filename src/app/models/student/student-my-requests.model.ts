export interface StudentMyRequestRowDTO {
  requestId: number;        // idsolicitudrefuerzo
  dateTime: string;         // fecha_hora (ISO)
  subjectCode: string;      // asignatura_codigo
  subjectName: string;      // asignatura_nombre
  topic: string;            // tema
  teacher: string;          // docente
  type: string;             // tipo
  status: string;           // estado
}

export interface PageResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  size: number;
}
