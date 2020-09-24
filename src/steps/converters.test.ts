import {
  createUserEntity,
  createGroupEntity,
  createGroupUserRelationship,
  createGroupGroupRelationship,
} from './converters';
import { Entities } from '../constants';

test('createUserEntity', () => {
  const user = {
    calendar_integration: '1',
    country: '',
    user_password: 'some-bogus-password',
    last_login_time: '2020-09-23 22:00:16',
    source: '',
    sys_updated_on: '2020-09-23 22:07:54',
    building: '',
    web_service_access_only: 'false',
    notification: '2',
    enable_multifactor_authn: 'false',
    sys_updated_by: 'j1-administrator',
    sys_created_on: '2020-09-21 17:57:17',
    sys_domain: {
      link:
        'https://dev94579.service-now.com/api/now/table/sys_user_group/global',
      value: 'global',
    },
    state: '',
    vip: 'false',
    sys_created_by: 'admin',
    zip: '',
    home_phone: '',
    time_format: '',
    last_login: '2020-09-23',
    default_perspective: '',
    active: 'true',
    sys_domain_path: '/',
    cost_center: '',
    phone: '',
    name: 'Jupiterone Administrator',
    employee_number: '',
    password_needs_reset: 'false',
    gender: '',
    city: '',
    failed_attempts: '0',
    user_name: 'j1-administrator',
    roles: '',
    title: '',
    sys_class_name: 'sys_user',
    sys_id: '5ccbba87db1310109d87a9954b9619db',
    internal_integration_user: 'false',
    ldap_server: '',
    mobile_phone: '',
    street: '',
    company: '',
    department: {
      link:
        'https://dev94579.service-now.com/api/now/table/cmn_department/9d7802bfdb1710109d87a9954b96199d',
      value: '9d7802bfdb1710109d87a9954b96199d',
    },
    first_name: 'Jupiterone',
    email: 'j1-admin@jupiterone.com',
    introduction: '',
    preferred_language: '',
    manager: '',
    locked_out: 'false',
    sys_mod_count: '5',
    last_name: 'Administrator',
    photo: '',
    avatar: '',
    middle_name: '',
    sys_tags: '',
    time_zone: '',
    schedule: '',
    date_format: '',
    location: '',
  };

  const userEntity = createUserEntity(user);

  expect(userEntity).toMatchSnapshot();
  expect(userEntity).toMatchGraphObjectSchema({
    _class: Entities.USER._class,
    schema: {},
  });
});

test('createGroupEntity', () => {
  const group = {
    parent: {
      link:
        'https://dev94579.service-now.com/api/now/table/sys_user_group/43f6027fdb1710109d87a9954b961939',
      value: '43f6027fdb1710109d87a9954b961939',
    },
    manager: '',
    roles: '',
    sys_mod_count: '0',
    active: 'true',
    description: '',
    source: '',
    sys_updated_on: '2020-09-23 22:03:48',
    sys_tags: '',
    type: '',
    sys_id: '66a74a7fdb1710109d87a9954b961914',
    sys_updated_by: 'j1-administrator',
    cost_center: '',
    default_assignee: '',
    sys_created_on: '2020-09-23 22:03:48',
    name: 'j1-subgroup',
    exclude_manager: 'false',
    email: 'j1-subgroup@jupiterone.com',
    include_members: 'false',
    sys_created_by: 'j1-administrator',
  };

  const groupEntity = createGroupEntity(group);

  expect(groupEntity).toMatchSnapshot();
  expect(groupEntity).toMatchGraphObjectSchema({
    _class: Entities.GROUP._class,
    schema: {},
  });

  const groupGroupRelationship = createGroupGroupRelationship(
    groupEntity,
    group.parent,
  );
  expect(groupGroupRelationship).toMatchSnapshot();
});

test('createGroupUserRelationship', () => {
  const groupUser = {
    sys_id: '94878e3fdb1710109d87a9954b96195f',
    sys_updated_by: 'j1-administrator',
    sys_created_on: '2020-09-23 22:02:55',
    sys_mod_count: '0',
    sys_updated_on: '2020-09-23 22:02:55',
    sys_tags: '',
    user: {
      link:
        'https://dev94579.service-now.com/api/now/table/sys_user/5ccbba87db1310109d87a9954b9619db',
      value: '5ccbba87db1310109d87a9954b9619db',
    },
    sys_created_by: 'j1-administrator',
    group: {
      link:
        'https://dev94579.service-now.com/api/now/table/sys_user_group/43f6027fdb1710109d87a9954b961939',
      value: '43f6027fdb1710109d87a9954b961939',
    },
  };

  const userGroupRelationship = createGroupUserRelationship(groupUser);

  expect(userGroupRelationship).toMatchSnapshot();
});
