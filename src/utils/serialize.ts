export function serializeCatArray(items: any[]): any[] {
  return items.map(item => ({ ...item }));
} 