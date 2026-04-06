import { Customer } from "../models/Customer.js"
import { Invoice } from "../models/Invoice.js"
import { Track } from "../models/Track.js"
import { SalesAgent } from "../models/SalesAgent.js"
import CustomersService from "./CustomersService.js"
import supabase from "../utils/supabase.js"
import { CustomerNotFound, InvoiceNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class CustomersServiceSupabase implements CustomersService {

    async getAllCustomers(): Promise<Customer[]> {
        const { data, error } = await supabase
            .from("customer")
            .select("customer_id, first_name, last_name, city, country, email")
        if (error) throw error
        logger.debug(`received ${data.length} customer objects`)
        return data
    }

    async getInvoices(customerId: number): Promise<Invoice[]> {
        const { data, error } = await supabase
            .from("invoice")
            .select("invoice_id, invoice_date, billing_address, billing_city, billing_country, total")
            .eq("customer_id", customerId)
        if (error) throw error
        logger.debug(`received ${data.length} invoices for customer ${customerId}`)
        return data
    }

    async getInvoiceTracks(invoiceId: number): Promise<Track[]> {
        const { data, error } = await supabase
            .from("invoice_line")
            .select("track(name, genre(name), media_type(name))")
            .eq("invoice_id", invoiceId)
        if (error) throw error
        if (data.length === 0) {
            throw new InvoiceNotFound(invoiceId)
        }
        const tracks: Track[] = data.map((row: any) => ({
            name: row.track.name,
            genre_name: row.track.genre?.name ?? null,
            media_type_name: row.track.media_type?.name ?? null
        }))
        logger.debug(`received ${tracks.length} tracks for invoice ${invoiceId}`)
        return tracks
    }

    async getSalesAgent(customerId: number): Promise<SalesAgent> {
        const { data: customer, error: custErr } = await supabase
            .from("customer")
            .select("support_rep_id")
            .eq("customer_id", customerId)
            .single()
        if (custErr || !customer) {
            throw new CustomerNotFound(customerId)
        }
        if (!customer.support_rep_id) {
            throw new CustomerNotFound(customerId)
        }
        const { data: agent, error: agentErr } = await supabase
            .from("employee")
            .select("first_name, last_name, birth_date, hire_date, city, country, email")
            .eq("employee_id", customer.support_rep_id)
            .single()
        if (agentErr || !agent) {
            throw new CustomerNotFound(customerId)
        }
        logger.debug(`received sales agent for customer ${customerId}`)
        return agent
    }
}

const customersService: CustomersService = new CustomersServiceSupabase()
export default customersService
