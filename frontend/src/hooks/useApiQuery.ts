import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';

export function useApiQuery<T = any>(
  queryKey: string[],
  apiFn: () => Promise<AxiosResponse>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiFn();
      return data.data;
    },
    ...options,
  });
}

export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (vars: TVariables) => Promise<AxiosResponse>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: string[][];
    onSuccess?: (data: AxiosResponse<TData>) => void;
  } = {}
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (options.successMessage) toast.success(options.successMessage);
      if (options.invalidateKeys) {
        options.invalidateKeys.forEach(key => qc.invalidateQueries({ queryKey: key }));
      }
      options.onSuccess?.(res);
    },
    onError: (e: any) => {
      toast.error(e.response?.data?.message || options.errorMessage || 'Operation failed');
    },
  });
}
