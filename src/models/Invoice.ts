export type Invoice = {
    invoice_id: number
    invoice_date: string
    billing_address: string | null
    billing_city: string | null
    billing_country: string | null
    total: number
}
