// src/app/shared/pipes/local-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  private readonly DEFAULT_TIMEZONE = 'America/Bahia';

  transform(
    value: string | Date | undefined | null,
    formatType: 'short' | 'long' | 'full' | 'relative' | 'time' | 'custom' = 'short',
    customFormat?: string,
    timezone: string = this.DEFAULT_TIMEZONE,
  ): string {
    if (!value) return 'N/A';

    try {
      const date = typeof value === 'string' ? parseISO(value) : value;

      if (!isValid(date)) {
        return 'Data inválida';
      }

      const zonedDate = toZonedTime(date, timezone);

      switch (formatType) {
        case 'short':
          return format(zonedDate, 'dd/MM/yyyy', { locale: ptBR });

        case 'long':
          return format(zonedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

        case 'full':
          return format(zonedDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

        case 'relative':
          return formatDistanceToNow(zonedDate, {
            addSuffix: true,
            locale: ptBR,
          });

        case 'time':
          return format(zonedDate, 'HH:mm', { locale: ptBR });

        case 'custom':
          return format(zonedDate, customFormat || 'dd/MM/yyyy', { locale: ptBR });

        default:
          return format(zonedDate, 'dd/MM/yyyy', { locale: ptBR });
      }
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  }
}
