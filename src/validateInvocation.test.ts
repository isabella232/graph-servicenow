import {
  isUserConfigError,
  isProviderAuthError,
} from '@jupiterone/integration-sdk-core';
import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';
import { setupServiceNowRecording, Recording } from '../test/util/recording';

test('Should throw if invalid configuration', async () => {
  const executionContext = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {} as IntegrationConfig,
  });

  let err;
  try {
    await validateInvocation(executionContext);
  } catch (e) {
    err = e;
  }

  expect(err).not.toBeUndefined();
  expect(err.message).toMatch(
    'Config requires all of {hostname, username, password}',
  );
  expect(isUserConfigError(err)).toBe(true);
});

test('Should throw if invalid hostname', async () => {
  const executionContext = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {
      hostname: 'invalid.service-now.com',
      username: 'invalid',
      password: 'invalid',
    },
  });

  let err;
  try {
    await validateInvocation(executionContext);
  } catch (e) {
    err = e;
  }

  expect(err).not.toBeUndefined();
  expect(err.message).toMatch(
    'Failure validating the ServiceNow API: getaddrinfo ENOTFOUND invalid.service-now.com',
  );
  expect(isUserConfigError(err)).toBe(true);
});

describe('recordings', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('Should throw if invalid credentials', async () => {
    recording = setupServiceNowRecording({
      directory: __dirname,
      name: 'validateInvocationFailsWithBadCredentials',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {
        hostname: 'dev94579.service-now.com',
        username: 'invalid',
        password: 'invalid',
      },
    });

    let err;
    try {
      await validateInvocation(executionContext);
    } catch (e) {
      err = e;
    }

    expect(err).not.toBeUndefined();
    expect(err.message).toMatch(
      'Provider authorization failed at https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=100: 401 {"error":{"detail":"Required to provide Auth information","message":"User Not Authenticated"},"status":"failure"}',
    );
    expect(isProviderAuthError(err)).toBe(true);
  });

  test('Should return undefined if valid credentials', async () => {
    recording = setupServiceNowRecording({
      directory: __dirname,
      name: 'validateInvocationFailsWithGoodCredentials',
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {
        hostname: 'dev94579.service-now.com',
        username: process.env.USERNAME || 'valid_username',
        password: process.env.PASSWORD || 'valid_password',
      },
    });

    const response = await validateInvocation(executionContext);
    expect(response).toBeUndefined();
  });
});
