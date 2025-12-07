import { ValidationError } from '../errors/app.errors';

export function validateRepositoryUrl(url: string): { owner: string; repo: string } {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    throw new ValidationError('Repository URL is required');
  }

  const trimmedUrl = url.trim();

  const fullUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/)?$/;
  const fullUrlMatch = trimmedUrl.match(fullUrlPattern);
  if (fullUrlMatch) {
    return {
      owner: fullUrlMatch[1],
      repo: fullUrlMatch[2].replace(/\.git$/, ''),
    };
  }

  const shortFormPattern = /^([^\/]+)\/([^\/]+)$/;
  const shortFormMatch = trimmedUrl.match(shortFormPattern);
  if (shortFormMatch) {
    return {
      owner: shortFormMatch[1],
      repo: shortFormMatch[2].replace(/\.git$/, ''),
    };
  }

  throw new ValidationError(
    'Invalid repository URL format. Expected: https://github.com/owner/repo or owner/repo',
    'url'
  );
}

export function validateId(id: string | number, resourceName: string = 'Resource'): number {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;

  if (isNaN(numId) || numId < 1) {
    throw new ValidationError(`Invalid ${resourceName} ID: ${id}`, 'id');
  }

  return numId;
}

