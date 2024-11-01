export interface Category {
  [key: string]: string[] | { [key: string]: string[] | Category };
}
