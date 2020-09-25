import axios, { AxiosError } from 'axios';

import { IntegrationConfig } from './types';
import { getServiceNowNextLink } from './util/getServiceNowNextLink';
import {
  IntegrationProviderAuthorizationError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

export enum ServiceNowTable {
  USER = 'sys_user',
  USER_GROUP = 'sys_user_group',
  DATABASE_TABLES = 'sys_db_object',
  GROUP_MEMBER = 'sys_user_grmember',
}

const DEFAULT_RESPONSE_LIMIT = 100;

/**
 * The ServiceNowClient maintains authentication state and provides an interface to
 * interact with the ServiceNow Table API.
 */
export class ServiceNowClient {
  private hostname: string;
  private username: string;
  private password: string;

  private limit: number;

  constructor(readonly config: IntegrationConfig, limit?: number) {
    this.hostname = config.hostname;
    this.username = config.username;
    this.password = config.password;

    this.limit = limit || DEFAULT_RESPONSE_LIMIT;
  }

  async validate() {
    const url = this.createRequestUrl({ table: ServiceNowTable.USER });
    try {
      await this.request({ url });
    } catch (err) {
      if (err.code === 'ENOTFOUND') {
        throw new IntegrationValidationError(
          `Failure validating the ServiceNow API: ${err.message}`,
        );
      }

      if (err.isAxiosError) {
        if ((err as AxiosError).response?.status === 401) {
          throw new IntegrationProviderAuthorizationError({
            cause: err,
            endpoint: url,
            status: (err as AxiosError).response?.status as number,
            statusText: JSON.stringify((err as AxiosError).response?.data),
          });
        }
      }

      throw err;
    }
  }

  private createRequestUrl(options: { table: ServiceNowTable }) {
    return `https://${this.hostname}/api/now/table/${options.table}?sysparm_limit=${this.limit}`;
  }

  private async request(options: { url: string }) {
    return await axios({
      method: 'GET',
      url: options.url,
      auth: {
        username: this.username,
        password: this.password,
      },
      responseType: 'json',
    });
  }

  private async iterateTableResources(options: {
    table: ServiceNowTable;
    callback: (r: any) => void | Promise<void>;
  }) {
    const { table, callback } = options;
    let url: string | undefined = this.createRequestUrl({ table });
    do {
      const response = await this.request({ url });

      await response.data.result.forEach(async (r) => {
        await callback(r);
      });
      url = getServiceNowNextLink(response?.headers?.link);
    } while (url);
  }

  async iterateUsers(callback: (r: any) => void | Promise<void>) {
    return this.iterateTableResources({
      table: ServiceNowTable.USER,
      callback,
    });
  }

  async iterateGroups(callback: (r: any) => void | Promise<void>) {
    return this.iterateTableResources({
      table: ServiceNowTable.USER_GROUP,
      callback,
    });
  }

  async iterateGroupMembers(callback: (r: any) => void | Promise<void>) {
    return this.iterateTableResources({
      table: ServiceNowTable.GROUP_MEMBER,
      callback,
    });
  }

  async listTableNames(tableNamePrefix: string = ''): Promise<string[]> {
    const tableNames: string[] = [];
    await this.iterateTableResources({
      table: ServiceNowTable.DATABASE_TABLES,
      callback: (t) => {
        if ((t.name as string).startsWith(tableNamePrefix)) {
          tableNames.push(t.name);
        }
      },
    });
    return tableNames;
  }
}
