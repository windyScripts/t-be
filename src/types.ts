import { Request } from "express"

type userPayload = {
    userId: string;
}

export type customRequest = Request & userPayload