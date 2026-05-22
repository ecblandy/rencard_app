// src/app/shared/services/date.service.ts
import { Injectable } from '@angular/core';
import {
  format,
  parseISO,
  formatDistanceToNow,
  isValid,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private readonly DEFAULT_TIMEZONE = 'America/Bahia';

  /**
   * Converte data UTC para timezone local
   */
  toLocalDate(date: string | Date, timezone: string = this.DEFAULT_TIMEZONE): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return toZonedTime(parsedDate, timezone);
  }

  /**
   * Converte data local para UTC
   */
  toUTC(date: Date, timezone: string = this.DEFAULT_TIMEZONE): Date {
    return fromZonedTime(date, timezone);
  }

  /**
   * Formata data com timezone
   */
  formatDate(
    date: string | Date | null | undefined,
    formatStr: string = 'dd/MM/yyyy',
    timezone: string = this.DEFAULT_TIMEZONE,
  ): string {
    if (!date) return 'N/A';

    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return 'Data inválida';

      const zonedDate = this.toLocalDate(parsedDate, timezone);
      return format(zonedDate, formatStr, { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  }

  /**
   * Retorna data relativa (há 2 dias, em 3 horas, etc)
   */
  getRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return 'N/A';

    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(parsedDate)) return 'Data inválida';

      const zonedDate = this.toLocalDate(parsedDate);
      return formatDistanceToNow(zonedDate, { addSuffix: true, locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  }

  /**
   * Verifica se a data é válida
   */
  isValidDate(date: string | Date | null | undefined): boolean {
    if (!date) return false;
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      return isValid(parsedDate);
    } catch {
      return false;
    }
  }

  /**
   * Adiciona dias à data
   */
  addDays(date: string | Date, days: number): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return addDays(parsedDate, days);
  }

  /**
   * Subtrai dias da data
   */
  subtractDays(date: string | Date, days: number): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return subDays(parsedDate, days);
  }

  /**
   * Retorna início do mês
   */
  getStartOfMonth(date: string | Date): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return startOfMonth(parsedDate);
  }

  /**
   * Retorna fim do mês
   */
  getEndOfMonth(date: string | Date): Date {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return endOfMonth(parsedDate);
  }
}
