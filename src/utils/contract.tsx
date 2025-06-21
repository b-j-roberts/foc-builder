import typesJson from '../configs/types.json';

export const getTypeColor = (type: string): string => {
  return typesJson[type as keyof typeof typesJson]?.color || typesJson['default'].color || '#FF00FF';
}
