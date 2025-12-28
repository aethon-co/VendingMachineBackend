export type AdminSchemaType = {
    name: string;
    mail: string;
    password: string;
    role: string;
}

export type AdminRegisterType = {
    name: string;
    mail: string;
    password: string;
}

export type AdminUpdateType = {
    name?: string;
    mail?: string;
    password?: string;
}

export type AdminLoginType = {
    mail: string;
    password: string;
}
