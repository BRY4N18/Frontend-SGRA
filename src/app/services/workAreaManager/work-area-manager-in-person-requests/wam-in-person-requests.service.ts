import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InPersonReinforcement } from '../../../models/workAreaManager/work-area-manager-in-person-requests';

@Injectable({
  providedIn: 'root',
})
export class WamInPersonRequestsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getInPersonReinforcements(userId: number): Observable<InPersonReinforcement[]> {
    let params = new HttpParams();
    params = params.set('userId', userId);
    return this.http.get<InPersonReinforcement[]>(
      `${this.apiUrl}/reinforcement/on-site-reinforcements/list-areas-ofsite`,
      { params },
    );

    //return of(this.getMockData());
  }

  // private getMockData(): InPersonReinforcement[] {
  //   return [
  //     {
  //       pidrefuerzopresencial: 1,
  //       pidrefuerzoprogramado: 101,
  //       phorainicio: '08:00',
  //       phorariofin: '10:00',
  //       pfechaprogramadarefuerzo: '2026-03-05',
  //       ptiposesion: 'Individual',
  //       pdocente: 'Ing. María López Torres',
  //       pparticipantesesperados: 5,
  //       participantesconfirmados: 3,
  //     },
  //     {
  //       pidrefuerzopresencial: 2,
  //       pidrefuerzoprogramado: 102,
  //       phorainicio: '10:00',
  //       phorariofin: '12:00',
  //       pfechaprogramadarefuerzo: '2026-03-06',
  //       ptiposesion: 'Grupal',
  //       pdocente: 'Ing. Carlos Mendoza Ruiz',
  //       pparticipantesesperados: 12,
  //       participantesconfirmados: 8,
  //     },
  //     {
  //       pidrefuerzopresencial: 3,
  //       pidrefuerzoprogramado: 103,
  //       phorainicio: '14:00',
  //       phorariofin: '16:00',
  //       pfechaprogramadarefuerzo: '2026-03-07',
  //       ptiposesion: 'Grupal',
  //       pdocente: 'Ing. Ana García Vera',
  //       pparticipantesesperados: 20,
  //       participantesconfirmados: 20,
  //     },
  //     {
  //       pidrefuerzopresencial: 4,
  //       pidrefuerzoprogramado: 104,
  //       phorainicio: '07:00',
  //       phorariofin: '09:00',
  //       pfechaprogramadarefuerzo: '2026-03-03',
  //       ptiposesion: 'Individual',
  //       pdocente: 'Ing. Pedro Salazar Núñez',
  //       pparticipantesesperados: 3,
  //       participantesconfirmados: 0,
  //     },
  //     {
  //       pidrefuerzopresencial: 5,
  //       pidrefuerzoprogramado: 105,
  //       phorainicio: '15:00',
  //       phorariofin: '17:00',
  //       pfechaprogramadarefuerzo: '2026-03-10',
  //       ptiposesion: 'Grupal',
  //       pdocente: 'Ing. Laura Díaz Paredes',
  //       pparticipantesesperados: 8,
  //       participantesconfirmados: 5,
  //     },
  //     {
  //       pidrefuerzopresencial: 6,
  //       pidrefuerzoprogramado: 106,
  //       phorainicio: '09:00',
  //       phorariofin: '11:00',
  //       pfechaprogramadarefuerzo: '2026-03-04',
  //       ptiposesion: 'Individual',
  //       pdocente: 'Ing. Roberto Herrera Paz',
  //       pparticipantesesperados: 1,
  //       participantesconfirmados: 1,
  //     },
  //   ];
  // }
}
