export interface Category {
  [key: string]: string[] | Category;
}

export interface Categories {
  [key: string]: Category;
} 