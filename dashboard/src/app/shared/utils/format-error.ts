export function formatErrorList(error: any): string[] {
  if (!error) return ['Ocorreu um erro inesperado.'];

  if (typeof error === 'string') return [error];

  if (Array.isArray(error)) return error;

  if (typeof error === 'object') {
    return Object.entries(error).flatMap(([key, messages]) => {
      if (Array.isArray(messages)) {
        return messages.map((msg) => `${key}: ${msg}`);
      }
      if (typeof messages === 'string') {
        return [`${key}: ${messages}`];
      }
      return [];
    });
  }

  return ['Ocorreu um erro inesperado.'];
}
