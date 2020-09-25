import {
  Entity,
  createIntegrationEntity,
  Relationship,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

function convertCommonServiceNowProperties(
  serviceNowObject: any,
): Record<string, string | boolean | number | null | undefined> {
  return {
    createdOn: new Date(serviceNowObject.sys_created_on + ' UTC').valueOf(),
    updatedOn: new Date(serviceNowObject.sys_updated_on + ' UTC').valueOf(),
    id: serviceNowObject.sys_id,
  };
}

export function createUserEntity(user: any): Entity {
  user.user_password = '[REDACTED]';
  return createIntegrationEntity({
    entityData: {
      source: {
        ...convertCommonServiceNowProperties(user),
        ...user,
      },
      assign: {
        _class: Entities.USER._class,
        _type: Entities.USER._type,
        _key: user.sys_id,
        username: user.user_name,
        active: user.active === 'true',
        email: user.email ? user.email : undefined,
      },
    },
  });
}

export function createGroupEntity(group: any): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...convertCommonServiceNowProperties(group),
        ...group,
      },
      assign: {
        _class: Entities.GROUP._class,
        _type: Entities.GROUP._type,
        _key: group.sys_id,
        active: group.active === 'true',
        email: group.email ? group.email : undefined,
      },
    },
  });
}

export function createGroupGroupRelationship(
  groupEntity: Entity,
  parent: { link: string; value: string },
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromType: Entities.GROUP._type,
    fromKey: parent.value,
    toType: Entities.GROUP._type,
    toKey: groupEntity._key,
  });
}

export function createGroupUserRelationship(groupUser: any): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    fromType: Entities.GROUP._type,
    fromKey: groupUser.group.value,
    toType: Entities.USER._type,
    toKey: groupUser.user.value,
    properties: convertCommonServiceNowProperties(groupUser),
  });
}
