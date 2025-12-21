export type FoodItemType = {
    rowNumber:number;
    name: string;
    price: number;
    quantity: number;
} | null
  
export type VendingMachineType = {
    name: string;
    row1: FoodItemType;
    row2: FoodItemType;
    row3: FoodItemType;
    row4: FoodItemType;
}

export type InstituteType = {
    name: string;
    mail: string;
    password: string;
    VendingMachines: [VendingMachineType]
}