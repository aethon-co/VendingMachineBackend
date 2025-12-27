export type InstituteSchemaType = {
    name: string;
    mail: string;
    password: string;
    refreshToken?: string;
    createdAt: string;
}

export type InstituteRegisterType = {
    name: string;
    mail: string;
    password: string;
}

export type InstituteLoginType = {
    mail: string;
    password: string;
}

export type InstituteUpdateType = {
    name: string;
    mail: string;
    password: string;
}


