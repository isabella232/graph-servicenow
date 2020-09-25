import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'step-account',
  USERS: 'step-users',
  GROUPS: 'step-groups',
  GROUP_MEMBERS: 'step-group-members',
};

export const Entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'service_now_account',
    _class: 'Account',
  },
  USER: {
    resourceName: 'User',
    _type: 'service_now_user',
    _class: 'User',
  },
  GROUP: {
    resourceName: 'User Group',
    _type: 'service_now_group',
    _class: 'UserGroup',
  },
};

export const Relationships = {
  ACCOUNT_HAS_USER: {
    _type: 'service_now_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'service_now_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'service_now_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  GROUP_HAS_GROUP: {
    _type: 'service_now_group_has_group',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
};
