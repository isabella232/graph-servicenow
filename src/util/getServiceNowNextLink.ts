/**
 * <https://some-link.com/resources?startAt=0>;rel="first",<https://some-link.com/resources?startAt=10>;rel="next" ->
 * https://some-link.com/resources?startAt=10
 */
export function getServiceNowNextLink(
  linkHeader: string | undefined,
): string | undefined {
  if (linkHeader !== undefined) {
    const links = linkHeader.split(',');
    const linksMap = links.reduce(
      (previousValue, currentValue, currentIndex, array) => {
        const [linkWithBrackets, rel] = currentValue.split(';');
        previousValue[rel] = removeBracketsFromLink(linkWithBrackets);
        return previousValue;
      },
      {},
    );

    return linksMap['rel="next"'];
  }
}

/**
 * <https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=605> ->
 * https://dev94579.service-now.com/api/now/table/sys_user?sysparm_limit=5&sysparm_offset=605
 */
function removeBracketsFromLink(linkWithBrackets: string): string {
  return linkWithBrackets.substring(1, linkWithBrackets.length - 1);
}
