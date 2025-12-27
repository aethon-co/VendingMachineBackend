export type AdminSchemaType = {
    name: string;
    email: string;
    password: string;
    role: string;
}

export type AdminRegisterType = {
    name: string;
    email: string;
    password: string;
}

export type AdminUpdateType = {
    name?: string;
    email?: string;
    password?: string;
}

export type AdminLoginType = {
    email: string;
    password: string;
}
