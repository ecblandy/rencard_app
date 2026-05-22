/**
 * Converte valores monetários ou porcentagens para o formato adequado
 * @param value - Valor a ser convertido (pode estar formatado)
 * @param type - Tipo do valor ('amount' para centavos, 'percent' para porcentagem)
 * @returns Número convertido (centavos para amount, valor direto para percent)
 */
export function convertToCents(value: number | string, type: 'percent' | 'amount'): number {
  if (!value) return 0;

  // Remove formatação (R$, %, pontos, vírgulas, espaços)
  const cleanValue = String(value)
    .replace(/[R$\s%]/g, '')
    .replace(/\./g, '') // Remove separador de milhar
    .replace(',', '.'); // Troca vírgula por ponto

  const numValue = parseFloat(cleanValue);

  if (isNaN(numValue)) return 0;

  // Se for amount, converte para centavos (multiplica por 100)
  if (type === 'amount') {
    return Math.round(numValue * 100);
  }

  // Se for percent, retorna o valor direto
  return numValue;
}

/**
 * Converte centavos de volta para reais formatados
 * @param cents - Valor em centavos
 * @returns String formatada como "R$ 10,50"
 */
export function centsToReal(cents: number): string {
  if (!cents || isNaN(cents)) return 'R$ 0,00';

  const reais = cents / 100;
  return `R$ ${reais.toFixed(2).replace('.', ',')}`;
}

/**
 * Converte centavos para número decimal
 * @param cents - Valor em centavos
 * @returns Número decimal (ex: 1050 → 10.50)
 */
export function centsToDecimal(cents: number): number {
  if (!cents || isNaN(cents)) return 0;
  return cents / 100;
}

/**
 * Formata número como porcentagem
 * @param value - Valor numérico
 * @returns String formatada como "20%"
 */
export function formatPercent(value: number): string {
  if (!value || isNaN(value)) return '0%';
  return `${value}%`;
}
