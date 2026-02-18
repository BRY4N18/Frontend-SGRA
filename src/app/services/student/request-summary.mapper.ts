import { RequestSummaryRowDTO, RequestSummaryRowUI, RequestStatus } from '../../models/student/request-summary.model';

export function mapSummaryDtoToUi(dto: RequestSummaryRowDTO): RequestSummaryRowUI {
  let parsed: RequestStatus = {
    estado: true,
    nombreestado: 'Desconocido',
    idestadosolicitudrefuerzo: dto.statusId
  };

  try {
    const obj = JSON.parse(dto.statusJson);
    parsed = {
      estado: Boolean(obj?.estado),
      nombreestado: String(obj?.nombreestado ?? 'Desconocido'),
      idestadosolicitudrefuerzo: Number(obj?.idestadosolicitudrefuerzo ?? dto.statusId)
    };
  } catch {
    // si viene mal, no revienta la UI
  }

  return {
    statusId: dto.statusId,
    status: parsed,
    total: Number(dto.total ?? 0)
  };
}
