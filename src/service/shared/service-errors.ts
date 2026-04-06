import ServiceError from "../../errors/ServiceError.js";

export class CustomerNotFound extends ServiceError {
    constructor(id: number) {
        super(404, `customer with id ${id} not found`)
    }
}
export class InvoiceNotFound extends ServiceError {
    constructor(id: number) {
        super(404, `invoice with id ${id} not found`)
    }
}
export class AlbumNotFound extends ServiceError {
    constructor(id: number) {
        super(404, `album with id ${id} not found`)
    }
}
export class PlaylistNotFound extends ServiceError {
    constructor(id: number) {
        super(404, `playlist with id ${id} not found`)
    }
}
export class AccountingError extends ServiceError {
    constructor() {
        super(400, "Incorrect User credentials")
    }
}
export class AccountAlreadyExists extends ServiceError {
    constructor(username: string) {
        super(409, `account ${username} already exists`)
    }
}
export class AccountNotFound extends ServiceError {
    constructor(username: string) {
        super(404, `account ${username} not found`)
    }
}
