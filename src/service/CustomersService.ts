import { Customer } from "../models/Customer.js"
import { Invoice } from "../models/Invoice.js"
import { Track } from "../models/Track.js"
import { SalesAgent } from "../models/SalesAgent.js"

export default interface CustomersService {
    getAllCustomers(): Promise<Customer[]>
    getInvoices(customerId: number): Promise<Invoice[]>
    getInvoiceTracks(invoiceId: number): Promise<Track[]>
    getSalesAgent(customerId: number): Promise<SalesAgent>
}
