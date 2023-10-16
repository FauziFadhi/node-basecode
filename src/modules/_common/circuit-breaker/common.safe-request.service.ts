import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as urljoin from 'url-join';
import { CBOptions, CircuitBreaker } from './common.circuit-breaker';

@Injectable()
export class SafeRequest {
  constructor(
    private readonly circuitBreaker: CircuitBreaker,
  ) {
  }

  private getResponse() {
    return {
      getErrorData: (err) => err.response?.data,
      getResponseData: (response) => response.data,
      getErrorStatus: (err) => err.response?.status,
    };
  }

  async get<T = unknown, R = AxiosResponse<T, unknown>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D> & { cbOptions?: Omit<CBOptions, 'method' | 'path' | 'getErrorData' | 'getResponseData' | 'getErrorStatus'> },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};
    return this.circuitBreaker.fire<R>(
      axios.get,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urljoin(config?.baseURL, url) : url,
        method: 'get',
      },
      url,
      restConfig,
    );
  }

  async post<T = unknown, R = AxiosResponse<T, unknown>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { cbOptions?: Omit<CBOptions, 'method' | 'path' | 'getErrorData' | 'getResponseData' | 'getErrorStatus'> },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.post,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urljoin(config?.baseURL, url) : url,
        method: 'post',
      },
      url,
      data,
      restConfig,
    );
  }

  async patch<T = unknown, R = AxiosResponse<T, unknown>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { cbOptions?: Omit<CBOptions, 'method' | 'path' | 'getErrorData' | 'getResponseData' | 'getErrorStatus'> },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.patch,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urljoin(config?.baseURL, url) : url,
        method: 'patch',
      },
      url,
      data,
      restConfig,
    );
  }

  async put<T = unknown, R = AxiosResponse<T, unknown>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D> & { cbOptions?: Omit<CBOptions, 'method' | 'path' | 'getErrorData' | 'getResponseData' | 'getErrorStatus'> },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.put,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urljoin(config?.baseURL, url) : url,
        method: 'put',
      },
      url,
      data,
      restConfig,
    );
  }

  async delete<T = unknown, R = AxiosResponse<T, unknown>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D> & { cbOptions?: Omit<CBOptions, 'method' | 'path' | 'getErrorData' | 'getResponseData' | 'getErrorStatus'> },
  ): Promise<R> {
    const { cbOptions = {}, ...restConfig } = config || {};

    return this.circuitBreaker.fire<R>(
      axios.delete,
      {
        ...this.getResponse(),
        ...cbOptions,
        path: config?.baseURL ? urljoin(config?.baseURL, url) : url,
        method: 'delete',
      },
      url,
      restConfig,
    );
  }
}
