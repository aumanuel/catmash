import { useMutation } from '@tanstack/react-query';
import { voteForMatch } from '@/services/client/cats';

export function useVoteForMatch(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
}) {
  return useMutation({
    mutationFn: voteForMatch,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onMutate: options?.onMutate,
  });
} 