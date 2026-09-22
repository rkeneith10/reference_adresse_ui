import { SideNavItem } from "@/types";

export const getVisibleSideNavItems = (
  items: SideNavItem[],
  userRole: string | undefined
): SideNavItem[] => {
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

