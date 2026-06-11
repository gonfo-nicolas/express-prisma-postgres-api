export type PaginationInput = {
  page: number;
  limit: number;
};

export type PaginationMeta = PaginationInput & {
  total: number;
};

export const getOffset = ({ page, limit }: PaginationInput): number => (page - 1) * limit;
