import { FacetItem } from "@/core/types";

export type ProductsSearchParams = {
  page?: number;
  itemsPerPage?: number;
  keyword?: string;
  sort?: string;
  filter?: string;
  fuzzy?: boolean;
  fuzzyLevel?: number;
  categoryId?: string;
  productIds?: string[];
};

export type ProductsFilters = {
  facets: FacetItem[];
  inStock: boolean;
  branches: string[];
};
