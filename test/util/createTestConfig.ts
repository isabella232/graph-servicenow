import { IntegrationConfig } from '../../src/types';

const defaultConfig: IntegrationConfig = {
  hostname: 'default-hostname.service-now.com',
  username: 'default-username',
  password: 'default-password',
};

export function createTestConfig(): IntegrationConfig {
  return {
    hostname: process.env.HOSTNAME || defaultConfig.hostname,
    username: process.env.USERNAME || defaultConfig.username,
    password: process.env.PASSWORD || defaultConfig.password,
  };
}
