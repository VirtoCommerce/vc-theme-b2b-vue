import { RouteLocationRaw } from "vue-router";
import { CategoryTreeItemType } from "@/core";
import { Category } from "@/xapi";

export function getCategoryRoute(category: Category | CategoryTreeItemType): RouteLocationRaw {
  return category.slug ? `/${category.slug}` : { name: "Category", params: { categoryId: category.id } };
}

function categoryToCategoryTreeItem(category: Category, parent: CategoryTreeItemType): CategoryTreeItemType {
  return { ...category, parent, children: [] };
}

export function buildCategoryTree(parent: CategoryTreeItemType, categories: Category[]): CategoryTreeItemType {
  parent.children = categories
    .filter((item) => (parent.isRoot && !item.parent?.id) || item.parent?.id === parent.id)
    .map((item) => buildCategoryTree(categoryToCategoryTreeItem(item, parent), categories));

  return parent;
}

export function searchCategoryTreeItemByKey(
  categoryTreeItem: CategoryTreeItemType,
  key: keyof CategoryTreeItemType,
  value: any
): CategoryTreeItemType | undefined {
  if (categoryTreeItem[key] === value) {
    return categoryTreeItem;
  }

  for (const item of categoryTreeItem.children) {
    const category = searchCategoryTreeItemByKey(item, key, value);

    if (category) {
      return category;
    }
  }

  return undefined;
}
