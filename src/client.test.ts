import { setupServiceNowRecording, Recording } from '../test/util/recording';
import { ServiceNowClient } from './client';
import { createTestConfig } from '../test/util/createTestConfig';

const config = createTestConfig();

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

describe('iterateUsers', () => {
  test('all', async () => {
    recording = setupServiceNowRecording({
      directory: __dirname,
      name: 'iterateUsers',
    });

    const client = new ServiceNowClient(config);

    const resources: any[] = [];
    await client.iterateUsers((u) => {
      resources.push(u);
    });

    expect(resources).toContainEqual(
      expect.objectContaining({
        user_name: 'j1-administrator',
      }),
    );
  }, 10000);
});

describe('iterateGroups', () => {
  test('all', async () => {
    recording = setupServiceNowRecording({
      directory: __dirname,
      name: 'iterateGroups',
    });

    const client = new ServiceNowClient(config);

    const resources: any[] = [];
    await client.iterateGroups((g) => {
      resources.push(g);
    });

    expect(resources).toContainEqual(
      expect.objectContaining({
        name: 'j1-group',
      }),
    );
  });
});

describe('iterateGroupMembers', () => {
  test('all', async () => {
    recording = setupServiceNowRecording({
      directory: __dirname,
      name: 'iterateGroupMembers',
    });

    const client = new ServiceNowClient(config);

    const resources: any[] = [];
    await client.iterateGroupMembers((g) => {
      resources.push(g);
    });

    expect(resources).toContainEqual(
      expect.objectContaining({
        user: {
          link: expect.any(String),
          value: '1832fbe1d701120035ae23c7ce610369',
        },
        group: {
          link: expect.any(String),
          value: '0a52d3dcd7011200f2d224837e6103f2',
        },
      }),
    );
  });
});
