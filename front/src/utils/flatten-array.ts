/**
 * Recursively flattens a nested array structure by extracting children from each item.
 * Useful for flattening tree-like data structures such as navigation menus.
 * Note: Recursively processes nested children arrays until all levels are flattened.
 */
// ----------------------------------------------------------------------

export function flattenArray<T>(list: T[], key = 'children'): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}
