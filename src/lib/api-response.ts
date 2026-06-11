export type ApiResponse<TData> = {
  data: TData;
};

export type ApiListResponse<TData> = {
  data: TData[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};
