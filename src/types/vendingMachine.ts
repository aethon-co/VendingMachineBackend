export type FoodItemType = {
    name: string;
    price: number;
    quantity: number;
}
  
export type VendingMachineType = {
    name: string;
    institute: string;
    items: FoodItemType[];
}
  