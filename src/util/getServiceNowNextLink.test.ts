import { getServiceNowNextLink } from './getServiceNowNextLink';

test('Should extract next link', () => {
  const nextLink = getServiceNowNextLink(
    '<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=0>;rel="first",<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=595>;rel="prev",<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=605>;rel="next",<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=610>;rel="last"',
  );
  expect(nextLink).toBe(
    'https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=605',
  );
});

test('Should return undefined when there is no next link', () => {
  const nextLink = getServiceNowNextLink(
    '<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=0>;rel="first",<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=605>;rel="prev",<https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=610>;rel="last"',
  );
  expect(nextLink).toBe(undefined);
});
