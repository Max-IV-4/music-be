import { Customer } from "../models/Customer.js"
import { Invoice } from "../models/Invoice.js"
import { Track } from "../models/Track.js"
import { SalesAgent } from "../models/SalesAgent.js"
import CustomersService from "./CustomersService.js"
import db from "../utils/db.js"
import { CustomerNotFound, InvoiceNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class CustomersServiceKnex implements CustomersService {

    async getAllCustomers(): Promise<Customer[]> {
        const customers = await db("customer")
            .select("customer_id", "first_name", "last_name", "city", "country", "email")
        logger.debug(`received ${customers.length} customer objects`)
        return customers
    }

    async getInvoices(customerId: number): Promise<Invoice[]> {
        const invoices = await db("invoice")
            .select("invoice_id", "invoice_date", "billing_address", "billing_city", "billing_country", "total")
            .where("customer_id", customerId)
        logger.debug(`received ${invoices.length} invoices for customer ${customerId}`)
        return invoices
    }

    async getInvoiceTracks(invoiceId: number): Promise<Track[]> {
        const rows = await db("invoice_line")
            .join("track", "invoice_line.track_id", "track.track_id")
            .leftJoin("genre", "track.genre_id", "genre.genre_id")
            .leftJoin("media_type", "track.media_type_id", "media_type.media_type_id")
            .select(
                "track.name",
                "genre.name as genre_name",
                "media_type.name as media_type_name"
            )
            .where("invoice_line.invoice_id", invoiceId)
        if (rows.length === 0) {
            throw new InvoiceNotFound(invoiceId)
        }
        logger.debug(`received ${rows.length} tracks for invoice ${invoiceId}`)
        return rows
    }

    async getSalesAgent(customerId: number): Promise<SalesAgent> {
        const agent = await db("customer")
            .join("employee", "customer.support_rep_id", "employee.employee_id")
            .select(
                "employee.first_name",
                "employee.last_name",
                "employee.birth_date",
                "employee.hire_date",
                "employee.city",
                "employee.country",
                "employee.email"
            )
            .where("customer.customer_id", customerId)
            .first()
        if (!agent) {
            throw new CustomerNotFound(customerId)
        }
        logger.debug(`received sales agent for customer ${customerId}`)
        return agent
    }
}

const customersService: CustomersService = new CustomersServiceKnex()
export default customersService
