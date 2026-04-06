import express, { Request, Response } from "express"
import customersService from "../../service/CustomersServiceImpl.js"
import { auth } from "../../middleware/auth.js"
import logger from "../../logger.js"

const customersRouter = express.Router()

customersRouter.get("/", auth("SALE", "SUPER_USER"), async (_req: Request, res: Response) => {
    const customers = await customersService.getAllCustomers()
    logger.debug(`received ${customers.length} customer objects`)
    res.json(customers)
})

customersRouter.get("/:customerId/invoices", auth("SALE", "SUPER_USER"),
    async (req: Request<{ customerId: string }>, res: Response) => {
        const customerId = +req.params.customerId
        const invoices = await customersService.getInvoices(customerId)
        res.json(invoices)
    })

customersRouter.get("/:customerId/invoices/:invoiceId/tracks", auth("SALE", "SUPER_USER"),
    async (req: Request<{ customerId: string; invoiceId: string }>, res: Response) => {
        const invoiceId = +req.params.invoiceId
        const tracks = await customersService.getInvoiceTracks(invoiceId)
        res.json(tracks)
    })

customersRouter.get("/:customerId/agent", auth("SALE", "SUPER_USER"),
    async (req: Request<{ customerId: string }>, res: Response) => {
        const customerId = +req.params.customerId
        const agent = await customersService.getSalesAgent(customerId)
        res.json(agent)
    })

export default customersRouter
