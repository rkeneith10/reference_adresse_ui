

export const getVisibleSideNavItems = (
  items: { title: string; path: string; isAdminOnly?: boolean }[],
  userRole: string | undefined
) => {
  return items.filter((item) => {
    if (item.isAdminOnly && userRole !== "admin") return false;
    return true;
  });
};
