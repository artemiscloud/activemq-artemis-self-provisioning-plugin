import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { SimpleResponse } from '../requests/models/SimpleResponse';
import { OperationRef } from '../requests/models/OperationRef';
import { BrokersResponse } from '../requests/models/BrokersResponse';
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
    [useJolokiaServiceGetBrokersKey, ...(queryKey ?? [])],
    () => JolokiaService.getBrokers(),
    options,
  );
export const useJolokiaServiceGetBrokerDetailsKey =
  'JolokiaServiceGetBrokerDetails';
export const useJolokiaServiceGetBrokerDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
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
    [useJolokiaServiceGetBrokerDetailsKey, ...(queryKey ?? [])],
    () => JolokiaService.getBrokerDetails(),
    options,
  );
export const useJolokiaServiceReadBrokerAttributesKey =
  'JolokiaServiceReadBrokerAttributes';
export const useJolokiaServiceReadBrokerAttributes = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    names,
  }: {
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
    [useJolokiaServiceReadBrokerAttributesKey, ...(queryKey ?? [{ names }])],
    () => JolokiaService.readBrokerAttributes(names),
    options,
  );
export const useJolokiaServiceExecBrokerOperation = (
  options?: Omit<
    UseMutationOptions<
      Awaited<ReturnType<typeof JolokiaService.execBrokerOperation>>,
      unknown,
      {
        requestBody: OperationRef;
      },
      unknown
    >,
    'mutationFn'
  >,
) =>
  useMutation(
    ({ requestBody }) => JolokiaService.execBrokerOperation(requestBody),
    options,
  );
export const useJolokiaServiceGetBrokerComponentsKey =
  'JolokiaServiceGetBrokerComponents';
export const useJolokiaServiceGetBrokerComponents = <
  TQueryKey extends Array<unknown> = unknown[],
>(
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
    [useJolokiaServiceGetBrokerComponentsKey, ...(queryKey ?? [])],
    () => JolokiaService.getBrokerComponents(),
    options,
  );
export const useJolokiaServiceGetAddressesKey = 'JolokiaServiceGetAddresses';
export const useJolokiaServiceGetAddresses = <
  TQueryKey extends Array<unknown> = unknown[],
>(
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
    [useJolokiaServiceGetAddressesKey, ...(queryKey ?? [])],
    () => JolokiaService.getAddresses(),
    options,
  );
export const useJolokiaServiceGetQueuesKey = 'JolokiaServiceGetQueues';
export const useJolokiaServiceGetQueues = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    address,
  }: {
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
    [useJolokiaServiceGetQueuesKey, ...(queryKey ?? [{ address }])],
    () => JolokiaService.getQueues(address),
    options,
  );
export const useJolokiaServiceGetQueueDetailsKey =
  'JolokiaServiceGetQueueDetails';
export const useJolokiaServiceGetQueueDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
    routingType,
    addressName,
  }: {
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
      ...(queryKey ?? [{ name, routingType, addressName }]),
    ],
    () => JolokiaService.getQueueDetails(name, routingType, addressName),
    options,
  );
export const useJolokiaServiceGetAddressDetailsKey =
  'JolokiaServiceGetAddressDetails';
export const useJolokiaServiceGetAddressDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
  }: {
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
    [useJolokiaServiceGetAddressDetailsKey, ...(queryKey ?? [{ name }])],
    () => JolokiaService.getAddressDetails(name),
    options,
  );
export const useJolokiaServiceGetAcceptorsKey = 'JolokiaServiceGetAcceptors';
export const useJolokiaServiceGetAcceptors = <
  TQueryKey extends Array<unknown> = unknown[],
>(
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
    [useJolokiaServiceGetAcceptorsKey, ...(queryKey ?? [])],
    () => JolokiaService.getAcceptors(),
    options,
  );
export const useJolokiaServiceGetAcceptorDetailsKey =
  'JolokiaServiceGetAcceptorDetails';
export const useJolokiaServiceGetAcceptorDetails = <
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    name,
  }: {
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
    [useJolokiaServiceGetAcceptorDetailsKey, ...(queryKey ?? [{ name }])],
    () => JolokiaService.getAcceptorDetails(name),
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
