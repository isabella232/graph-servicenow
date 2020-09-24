import {
  Step,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../types';
import { Steps, Entities, Relationships } from '../constants';
import { ServiceNowClient } from '../client';
import {
  createUserEntity,
  createGroupEntity,
  createGroupUserRelationship,
  createGroupGroupRelationship,
} from './converters';

export async function fetchUsers(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { instance, jobState } = context;

  const client = new ServiceNowClient(instance.config);

  await client.iterateUsers(async (user) => {
    await jobState.addEntity(createUserEntity(user));
  });
}

export async function fetchGroups(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { instance, jobState } = context;

  const client = new ServiceNowClient(instance.config);

  await client.iterateGroups(async (group) => {
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(createGroupEntity(group));
    if (group.parent) {
      const groupGroupRelationship = createGroupGroupRelationship(
        groupEntity,
        group.parent,
      );
      await jobState.addRelationship(groupGroupRelationship);
    }
  });
}

export async function buildGroupUserRelationships(
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const { instance, jobState } = context;

  const client = new ServiceNowClient(instance.config);

  await client.iterateGroupMembers(async (groupMember) => {
    await jobState.addRelationship(createGroupUserRelationship(groupMember));
  });
}

export const integrationSteps: Step<
  IntegrationStepExecutionContext<IntegrationConfig>
>[] = [
  {
    id: Steps.USERS,
    name: 'Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
  {
    id: Steps.GROUPS,
    name: 'Groups',
    entities: [Entities.GROUP],
    relationships: [Relationships.GROUP_HAS_GROUP],
    dependsOn: [],
    executionHandler: fetchGroups,
  },
  {
    id: Steps.GROUP_MEMBERS,
    name: 'Group Members',
    entities: [],
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.USERS, Steps.GROUPS],
    executionHandler: buildGroupUserRelationships,
  },
];
