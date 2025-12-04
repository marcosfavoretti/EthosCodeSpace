import { format } from 'date-fns';
import { parse } from 'date-fns';

export function formatddMMyyyy(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

export function formatdd_MM_yyyy(date: string): string {
  return format(date, 'dd/MM/yyyy');
}

export function parseDD_MM_yyyy_str(dateStr: string): Date {
  return parse(dateStr, 'dd-MM-yyyy', new Date());
}
