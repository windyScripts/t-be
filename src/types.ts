import { Request } from "express"

type userPayload = {
    userEmail?: string;
}

export type customRequest = Request & userPayload
