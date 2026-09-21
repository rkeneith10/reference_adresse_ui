

export const getVisibleSideNavItems = (
  items: { title: string; path: string; isAdminOnly?: boolean }[],
  userRole: string | undefined
) => {
  return items.filter((item) => {
    if (item.isAdminOnly && userRole !== "admin") return false;
    return true;
  });
};

/**
 * Returns the value or 'N/A' if the value is null, undefined, or empty.
 */
export const formatValue = (value: any): string => {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
    return "N/A";
  }
  return String(value);
};

