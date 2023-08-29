namespace WebCAP
{
    public class InvoiceResponce
    {
        public string _object { get; set; }
        public Datum[] data { get; set; }
        public bool has_more { get; set; }
        public string url { get; set; }
    }

    public class Datum
    {
        public string id { get; set; }
        public string _object { get; set; }
        public string account_country { get; set; }
        public string account_name { get; set; }
        public object account_tax_ids { get; set; }
        public int amount_due { get; set; }
        public int amount_paid { get; set; }
        public int amount_remaining { get; set; }
        public object application_fee_amount { get; set; }
        public int attempt_count { get; set; }
        public bool attempted { get; set; }
        public bool auto_advance { get; set; }
        public string billing_reason { get; set; }
        public string charge { get; set; }
        public string collection_method { get; set; }
        public int created { get; set; }
        public string currency { get; set; }
        public object custom_fields { get; set; }
        public string customer { get; set; }
        public object customer_address { get; set; }
        public string customer_email { get; set; }
        public object customer_name { get; set; }
        public object customer_phone { get; set; }
        public object customer_shipping { get; set; }
        public string customer_tax_exempt { get; set; }
        public object[] customer_tax_ids { get; set; }
        public object default_payment_method { get; set; }
        public object default_source { get; set; }
        public object[] default_tax_rates { get; set; }
        public object description { get; set; }
        public Discount discount { get; set; }
        public string[] discounts { get; set; }
        public object due_date { get; set; }
        public int ending_balance { get; set; }
        public object footer { get; set; }
        public string hosted_invoice_url { get; set; }
        public string invoice_pdf { get; set; }
        public object last_finalization_error { get; set; }
        public Lines lines { get; set; }
        public bool livemode { get; set; }
        public Metadata4 metadata { get; set; }
        public object next_payment_attempt { get; set; }
        public string number { get; set; }
        public bool paid { get; set; }
        public string payment_intent { get; set; }
        public int period_end { get; set; }
        public int period_start { get; set; }
        public int post_payment_credit_notes_amount { get; set; }
        public int pre_payment_credit_notes_amount { get; set; }
        public object receipt_number { get; set; }
        public int starting_balance { get; set; }
        public object statement_descriptor { get; set; }
        public string status { get; set; }
        public Status_Transitions status_transitions { get; set; }
        public string subscription { get; set; }
        public int subtotal { get; set; }
        public object tax { get; set; }
        public int total { get; set; }
        public Total_Discount_Amounts[] total_discount_amounts { get; set; }
        public object[] total_tax_amounts { get; set; }
        public object transfer_data { get; set; }
        public int webhooks_delivered_at { get; set; }
    }

    public class Discount
    {
        public string id { get; set; }
        public string _object { get; set; }
        public object checkout_session { get; set; }
        public CouponStripe coupon { get; set; }
        public string customer { get; set; }
        public object end { get; set; }
        public object invoice { get; set; }
        public object invoice_item { get; set; }
        public string promotion_code { get; set; }
        public int start { get; set; }
        public string subscription { get; set; }
    }

    public class CouponStripe
    {
        public string id { get; set; }
        public string _object { get; set; }
        public int amount_off { get; set; }
        public int created { get; set; }
        public string currency { get; set; }
        public string duration { get; set; }
        public object duration_in_months { get; set; }
        public bool livemode { get; set; }
        public object max_redemptions { get; set; }
        public Metadata metadata { get; set; }
        public string name { get; set; }
        public object percent_off { get; set; }
        public object redeem_by { get; set; }
        public int times_redeemed { get; set; }
        public bool valid { get; set; }
    }

    public class Metadata
    {
    }

    public class Lines
    {
        public string _object { get; set; }
        public Datum1[] data { get; set; }
        public bool has_more { get; set; }
        public int total_count { get; set; }
        public string url { get; set; }
    }

    public class Datum1
    {
        public string id { get; set; }
        public string _object { get; set; }
        public int amount { get; set; }
        public string currency { get; set; }
        public string description { get; set; }
        public Discount_Amounts[] discount_amounts { get; set; }
        public bool discountable { get; set; }
        public object[] discounts { get; set; }
        public bool livemode { get; set; }
        public Metadata1 metadata { get; set; }
        public Period period { get; set; }
        public Plan plan { get; set; }
        public Price price { get; set; }
        public bool proration { get; set; }
        public int quantity { get; set; }
        public string subscription { get; set; }
        public string subscription_item { get; set; }
        public object[] tax_amounts { get; set; }
        public object[] tax_rates { get; set; }
        public string type { get; set; }
    }

    public class Metadata1
    {
    }

    public class Period
    {
        public int end { get; set; }
        public int start { get; set; }
    }

    public class Plan
    {
        public string id { get; set; }
        public string _object { get; set; }
        public bool active { get; set; }
        public object aggregate_usage { get; set; }
        public int amount { get; set; }
        public string amount_decimal { get; set; }
        public string billing_scheme { get; set; }
        public int created { get; set; }
        public string currency { get; set; }
        public string interval { get; set; }
        public int interval_count { get; set; }
        public bool livemode { get; set; }
        public Metadata2 metadata { get; set; }
        public object nickname { get; set; }
        public string product { get; set; }
        public object tiers_mode { get; set; }
        public object transform_usage { get; set; }
        public object trial_period_days { get; set; }
        public string usage_type { get; set; }
    }

    public class Metadata2
    {
    }

    public class Price
    {
        public string id { get; set; }
        public string _object { get; set; }
        public bool active { get; set; }
        public string billing_scheme { get; set; }
        public int created { get; set; }
        public string currency { get; set; }
        public bool livemode { get; set; }
        public object lookup_key { get; set; }
        public Metadata3 metadata { get; set; }
        public object nickname { get; set; }
        public string product { get; set; }
        public Recurring recurring { get; set; }
        public object tiers_mode { get; set; }
        public object transform_quantity { get; set; }
        public string type { get; set; }
        public int unit_amount { get; set; }
        public string unit_amount_decimal { get; set; }
    }

    public class Metadata3
    {
    }

    public class Recurring
    {
        public object aggregate_usage { get; set; }
        public string interval { get; set; }
        public int interval_count { get; set; }
        public object trial_period_days { get; set; }
        public string usage_type { get; set; }
    }

    public class Discount_Amounts
    {
        public int amount { get; set; }
        public string discount { get; set; }
    }

    public class Metadata4
    {
    }

    public class Status_Transitions
    {
        public int finalized_at { get; set; }
        public object marked_uncollectible_at { get; set; }
        public int paid_at { get; set; }
        public object voided_at { get; set; }
    }

    public class Total_Discount_Amounts
    {
        public int amount { get; set; }
        public string discount { get; set; }
    }
}
