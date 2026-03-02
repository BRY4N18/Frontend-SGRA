import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InPersonReinforcement } from '../../../models/workAreaManager/work-area-manager-in-person-requests';
import { WamInPersonRequestsService } from '../../../services/workAreaManager/work-area-manager-in-person-requests/wam-in-person-requests.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-work-area-manager-management-of-in-person-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-area-manager-management-of-in-person-requests.component.html',
  styleUrl: './work-area-manager-management-of-in-person-requests.component.css',
})
export class WorkAreaManagerManagementOfInPersonRequestsComponent implements OnInit {
  private inPersonService = inject(WamInPersonRequestsService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  reinforcements: InPersonReinforcement[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadReinforcements();
  }

  private loadReinforcements(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const userId = this.authService.currentUser()?.userId;

    if (!userId) return;

    this.inPersonService.getInPersonReinforcements(userId).subscribe({
      next: (data) => {
        this.reinforcements = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las solicitudes presenciales.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error al cargar refuerzos presenciales:', err);
      },
    });
  }

  getSessionBadgeClass(tipo: string): string {
    return tipo === 'Grupal' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info';
  }
}
