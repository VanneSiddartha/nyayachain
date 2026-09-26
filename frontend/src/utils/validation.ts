export const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'];

export function validateFile(file: File): string | null {
  const maxSize = 25 * 1024 * 1024;

  if (file.size > maxSize) {
    return 'File exceeds the 25 MB limit.';
  }

  if (!allowedMimeTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
    return 'Invalid file type.';
  }

  return null;
}

export function createMockHash(seed: string): string {
  return `mock-${seed.slice(0, 16)}-${Math.random().toString(16).slice(2, 10)}`;
}

export function getStatusTone(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === 'VALID' || normalized === 'APPROVED' || normalized === 'SUCCESS') return 'green';
  if (normalized === 'PENDING' || normalized === 'REVIEWED' || normalized === 'WARNING') return 'amber';
  if (normalized === 'RESTRICTED' || normalized === 'REJECTED' || normalized === 'ALERT') return 'red';
  return 'slate';
}
