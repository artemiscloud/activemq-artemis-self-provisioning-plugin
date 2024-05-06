import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { OperationRef } from '../requests/models/OperationRef';
import { SecurityService } from '../requests/services/SecurityService';
import { JolokiaService } from '../requests/services/JolokiaService';
import { DevelopmentService } from '../requests/services/DevelopmentService';
export const useSecurityServiceLogin = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof SecurityService.login>>,
      unknown,
      {
        formData: {
          brokerName: string;
          userName: string;
          password: string;
          jolokiaHost: string;
          scheme: string;
          port: string;
        };
      },
      unknown
    >,
    'mutationFn'
  >,
) => useMutation(({ formData }) => SecurityService.login(formData), options);
export const useJolokiaServiceGetBrokersKey = 'JolokiaServiceGetBrokers';
export const useJolokiaServiceGetBrokers = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
  }: {
    jolokiaSessionId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokers>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokers>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useJolokiaServiceGetBrokersKey, ...(queryKey ?? [{ jolokiaSessionId }])],
    () => JolokiaService.getBrokers(jolokiaSessionId),
    options,
  );
export const useJolokiaServiceGetBrokerDetailsKey =
  'JolokiaServiceGetBrokerDetails';
export const useJolokiaServiceGetBrokerDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
  }: {
    jolokiaSessionId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokerDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokerDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetBrokerDetailsKey,
      ...(queryKey ?? [{ jolokiaSessionId }]),
    ],
    () => JolokiaService.getBrokerDetails(jolokiaSessionId),
    options,
  );
export const useJolokiaServiceReadBrokerAttributesKey =
  'JolokiaServiceReadBrokerAttributes';
export const useJolokiaServiceReadBrokerAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
    names,
  }: {
    jolokiaSessionId: string;
    names?: Array<string>;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.readBrokerAttributes>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.readBrokerAttributes>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceReadBrokerAttributesKey,
      ...(queryKey ?? [{ jolokiaSessionId, names }]),
    ],
    () => JolokiaService.readBrokerAttributes(jolokiaSessionId, names),
    options,
  );
export const useJolokiaServiceExecBrokerOperation = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof JolokiaService.execBrokerOperation>>,
      unknown,
      {
        jolokiaSessionId: string;
        requestBody: OperationRef;
      },
      unknown
    >,
    'mutationFn'
  >,
) =>
  useMutation(
    ({ jolokiaSessionId, requestBody }) =>
      JolokiaService.execBrokerOperation(jolokiaSessionId, requestBody),
    options,
  );
export const useJolokiaServiceGetBrokerComponentsKey =
  'JolokiaServiceGetBrokerComponents';
export const useJolokiaServiceGetBrokerComponents = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
  }: {
    jolokiaSessionId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getBrokerComponents>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getBrokerComponents>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetBrokerComponentsKey,
      ...(queryKey ?? [{ jolokiaSessionId }]),
    ],
    () => JolokiaService.getBrokerComponents(jolokiaSessionId),
    options,
  );
export const useJolokiaServiceGetAddressesKey = 'JolokiaServiceGetAddresses';
export const useJolokiaServiceGetAddresses = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
  }: {
    jolokiaSessionId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAddresses>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAddresses>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useJolokiaServiceGetAddressesKey, ...(queryKey ?? [{ jolokiaSessionId }])],
    () => JolokiaService.getAddresses(jolokiaSessionId),
    options,
  );
export const useJolokiaServiceGetQueuesKey = 'JolokiaServiceGetQueues';
export const useJolokiaServiceGetQueues = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
    address,
  }: {
    jolokiaSessionId: string;
    address?: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getQueues>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getQueues>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetQueuesKey,
      ...(queryKey ?? [{ jolokiaSessionId, address }]),
    ],
    () => JolokiaService.getQueues(jolokiaSessionId, address),
    options,
  );
export const useJolokiaServiceGetQueueDetailsKey =
  'JolokiaServiceGetQueueDetails';
export const useJolokiaServiceGetQueueDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
    name,
    routingType,
    addressName,
  }: {
    jolokiaSessionId: string;
    name: string;
    routingType: string;
    addressName?: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getQueueDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getQueueDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetQueueDetailsKey,
      ...(queryKey ?? [{ jolokiaSessionId, name, routingType, addressName }]),
    ],
    () =>
      JolokiaService.getQueueDetails(
        jolokiaSessionId,
        name,
        routingType,
        addressName,
      ),
    options,
  );
export const useJolokiaServiceGetAddressDetailsKey =
  'JolokiaServiceGetAddressDetails';
export const useJolokiaServiceGetAddressDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
    name,
  }: {
    jolokiaSessionId: string;
    name: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAddressDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAddressDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetAddressDetailsKey,
      ...(queryKey ?? [{ jolokiaSessionId, name }]),
    ],
    () => JolokiaService.getAddressDetails(jolokiaSessionId, name),
    options,
  );
export const useJolokiaServiceGetAcceptorsKey = 'JolokiaServiceGetAcceptors';
export const useJolokiaServiceGetAcceptors = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
  }: {
    jolokiaSessionId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAcceptors>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAcceptors>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useJolokiaServiceGetAcceptorsKey, ...(queryKey ?? [{ jolokiaSessionId }])],
    () => JolokiaService.getAcceptors(jolokiaSessionId),
    options,
  );
export const useJolokiaServiceGetAcceptorDetailsKey =
  'JolokiaServiceGetAcceptorDetails';
export const useJolokiaServiceGetAcceptorDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    jolokiaSessionId,
    name,
  }: {
    jolokiaSessionId: string;
    name: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof JolokiaService.getAcceptorDetails>>,
      unknown,
      Awaited<ReturnType<typeof JolokiaService.getAcceptorDetails>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [
      useJolokiaServiceGetAcceptorDetailsKey,
      ...(queryKey ?? [{ jolokiaSessionId, name }]),
    ],
    () => JolokiaService.getAcceptorDetails(jolokiaSessionId, name),
    options,
  );
export const useDevelopmentServiceApiInfoKey = 'DevelopmentServiceApiInfo';
export const useDevelopmentServiceApiInfo = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof DevelopmentService.apiInfo>>,
      unknown,
      Awaited<ReturnType<typeof DevelopmentService.apiInfo>>,
      unknown[]
    >,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) =>
  useQuery(
    [useDevelopmentServiceApiInfoKey, ...(queryKey ?? [])],
    () => DevelopmentService.apiInfo(),
    options,
  );
