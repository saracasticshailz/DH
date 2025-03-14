import type { SortDirection } from '@/components/Rm/SortableTableHeader';

/**
 * Generic sort function for data tables
 */
export function sortData<T>(
  data: T[],
  sortField: keyof T,
  sortDirection: SortDirection,
  customSortFn?: (a: T, b: T, field: keyof T, direction: SortDirection) => number
): T[] {
  return [...data].sort((a, b) => {
    if (customSortFn) {
      return customSortFn(a, b, sortField, sortDirection);
    }

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Filter data based on search term across multiple fields
 */
export function filterData<T>(data: T[], searchTerm: string, searchFields: Array<keyof T>): T[] {
  if (!searchTerm) return data;

  const lowerSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
}

/**
 * Get paginated data
 */
export function paginateData<T>(data: T[], page: number, rowsPerPage: number): T[] {
  const startIndex = page * rowsPerPage;
  return data.slice(startIndex, startIndex + rowsPerPage);
}
