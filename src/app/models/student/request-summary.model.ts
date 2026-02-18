export interface RequestSummaryRowDTO {
  statusId: number;
  statusJson: string; // viene como string (JSON serializado)
  total: number;
}

export interface RequestStatus {
  estado: boolean;
  nombreestado: string;
  idestadosolicitudrefuerzo: number;
}

/** Ya parseado para UI */
export interface RequestSummaryRowUI {
  statusId: number;
  status: RequestStatus;
  total: number;
}
export type SummaryRowDTO = {
  statusId: number;
  statusJson: string;
  total: number;
};
