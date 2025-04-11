import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { API_URL } from '@/environment-config'


import { useErrorHandling } from '@/hooks/use-error'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type QueryConfig<TQueryKey, _TData> = {
  queryKey: TQueryKey
  apiRoute: string
  options?: Omit<AxiosRequestConfig, 'url' | 'method'> & {
    enabled?: boolean
    retry?: number
    staleTime?: number
    refetchOnWindowFocus?: boolean
    refetchOnMount?: boolean
    refetchOnReconnect?: boolean
    refetchInterval?: number | false
    cacheTime?: number
  }
}

type QueryConfigWithParams<TQueryKey, TData> = QueryConfig<TQueryKey, TData> & {
  params?: Record<string, string | number | boolean | null | undefined>
}



const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function useAppQuery<
  TData = unknown,
  TError = AxiosError,
  TQueryKey extends Array<unknown> = unknown[],
>(config: QueryConfig<TQueryKey, TData>): UseQueryResult<TData, TError> {
  const { queryKey, apiRoute, options } = config

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get<TData>(apiRoute, {
        ...options,
        headers: {},
      })

      if (!response?.data) {
        throw new Error('No data received from server. It may be network issue')
      }

      return response.data
    },

    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: options?.enabled !== false, // Allow enabled option
  })

  return useErrorHandling(() => query)()
}

export function useAppQueryWithPaginationAndParams<
  TData = unknown,
  TError = AxiosError,
  TQueryKey extends Array<unknown> = unknown[],
>(
  config: QueryConfigWithParams<TQueryKey, TData>
): UseQueryResult<TData, TError> {
  const { apiRoute, queryKey, options, params } = config

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const queryParams = params
        ? Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== null && value !== undefined) {
                acc[key] = typeof value === 'string' ? value.toLowerCase() : value
              }
              return acc
            },
            {} as Record<string, unknown>
          )
        : undefined

      const response = await axiosInstance.get<TData>(apiRoute, {
        ...options,
        params: queryParams,
      })

      if (!response?.data) {
        throw new Error('No data received from server. It may be network issue')
      }

      return (
        response.data ?? {
          count: 0,
          next: null,
          previous: null,
          results: [],
        }
      )
    },
    retry: 3,
    staleTime: 1000 * 60 * 5,
  })

  return useErrorHandling(() => query)()
}



export function useAppMutation<
  TData = unknown,
  TError = AxiosError,
  TVariables = unknown,
>(
  config: {
    apiRoute: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    options?: Omit<AxiosRequestConfig, 'url' | 'method'> & {
      enabled?: boolean;
    };
    onSuccess?: (data: NonNullable<TData>) => void;
    onError?: (error: TError) => void;
  }
): UseMutationResult<NonNullable<TData>, TError, { data: TVariables }> {
  const { apiRoute, method, options, onSuccess, onError } = config;

  const mutation = useMutation<NonNullable<TData>, TError, { data: TVariables }>({
    mutationFn: async ({ data }: { data: TVariables }) => {
      const response = await axiosInstance.request<TData>({
        url: apiRoute,
        method,
        data,
        ...options,
      });

      if (!response?.data) {
        throw new Error(
          'No data received from server. It may be network issue'
        );
      }

      return response.data as NonNullable<TData>;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
    retry: 0,
  });

  return useErrorHandling(() => mutation)();
}
