import { Pipe, PipeTransform } from '@angular/core';

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

@Pipe({
  name: 'dayName',
  standalone: true,
})
export class DayNamePipe implements PipeTransform {
  transform(day: number): string {
    return DAY_NAMES[day] ?? `Día ${day}`;
  }
}
