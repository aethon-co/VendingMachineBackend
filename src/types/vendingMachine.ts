export type FoodItemType = {
    name: string;
    price: number;
    quantity: number;
}
  
export type VendingMachineType = {
    name: string;
    items: FoodItemType[];
}

export type InstituteType = {
    name: string,
    mail: string,
    password: string,
    VendingMachines: [VendingMachineType]
}