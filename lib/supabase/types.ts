export type Role = 'admin' | 'customer'
export type CustomerStatus = 'active' | 'paused' | 'inactive'
export type ProjectStatus = 'pending' | 'active' | 'paused' | 'completed' | 'cancelled'
export type BillingInterval = 'monthly' | 'quarterly' | 'semi-annual' | 'yearly'
export type ServiceInterval = BillingInterval | 'one_time'
export type ServiceStatus = 'active' | 'paused' | 'ended'
export type ServiceType =
  | 'website'
  | 'hosting'
  | 'domain'
  | 'email'
  | 'maintenance'
  | 'seo'
  | 'geo'
  | 'google_ads'
  | 'social'
  | 'ai'
  | 'design'
  | 'other'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  customer_id: string | null
  created_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  org_number: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  customer_number: string | null
  notes: string | null
  status: CustomerStatus
  created_at: string
  updated_at: string
}

export interface Package {
  id: string
  name: string
  description: string | null
  price_monthly: number | null
  currency: string
  is_active: boolean
  created_at: string
}

export interface CustomerPackage {
  id: string
  customer_id: string
  package_id: string
  started_at: string
  ended_at: string | null
  created_at: string
  package?: Package
}

export interface Project {
  id: string
  customer_id: string
  name: string
  description: string | null
  status: ProjectStatus
  budget_hours: number | null
  started_at: string | null
  ended_at: string | null
  created_at: string
  updated_at: string
  customer?: Pick<Customer, 'id' | 'name'>
}

export interface TimeEntry {
  id: string
  project_id: string
  user_id: string | null
  description: string | null
  hours: number
  logged_on: string
  created_at: string
  project?: Pick<Project, 'id' | 'name'> & {
    customer?: Pick<Customer, 'id' | 'name'>
  }
}

export interface BillingSchedule {
  id: string
  customer_id: string
  package_id: string | null
  amount: number
  currency: string
  billing_interval: BillingInterval
  billing_day: number
  next_billing_date: string
  last_billed_date: string | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Pick<Customer, 'id' | 'name'>
  package?: Pick<Package, 'id' | 'name'>
}

export interface CustomerService {
  id: string
  customer_id: string
  name: string
  type: ServiceType
  domain: string | null
  description: string | null
  status: ServiceStatus
  billing_interval: ServiceInterval | null
  amount: number | null
  currency: string
  started_at: string
  renews_at: string | null
  ended_at: string | null
  created_at: string
  updated_at: string
}

export type ServiceRequestKind = 'service' | 'message'
export type ServiceRequestStatus = 'new' | 'in_progress' | 'done' | 'declined'

export interface ServiceRequest {
  id: string
  customer_id: string
  profile_id: string | null
  kind: ServiceRequestKind
  service_key: string | null
  service_name: string
  message: string | null
  status: ServiceRequestStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  customer?: Pick<Customer, 'id' | 'name'>
}

// ── Säljmaskin ───────────────────────────────────────────────
export type OpportunityKind = 'upsell' | 'new' | 'reactivation'
export type OpportunityStage = 'identified' | 'to_contact' | 'contacted' | 'dialog' | 'proposal' | 'won' | 'lost'
export type OpportunitySource = 'agent' | 'manual'
/** recurring = kr/år, one_time = engångsbelopp. */
export type OpportunityValueType = 'recurring' | 'one_time'

export interface SalesOpportunity {
  id: string
  company: string
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  city: string | null
  customer_id: string | null
  kind: OpportunityKind
  service_key: string | null
  service_name: string | null
  stage: OpportunityStage
  priority: 1 | 2 | 3
  source: OpportunitySource
  lead_source: string | null
  summary: string | null
  evidence: string | null
  gmail_thread_id: string | null
  draft_subject: string | null
  draft_body: string | null
  estimated_value: number | null
  value_type: OpportunityValueType
  next_action_at: string | null
  meeting_at: string | null
  stage_changed_at: string
  sent_at: string | null
  replied_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  customer?: Pick<Customer, 'id' | 'name'> | null
}

export interface SalesAgentRun {
  id: string
  ran_at: string
  threads_scanned: number
  opportunities_created: number
  opportunities_updated: number
  summary: string | null
  created_at: string
}

export type ReportClientStatus = 'active' | 'paused'

export interface MonthlyReport {
  id: string
  report_client_id: string
  period: string
  sent_at: string | null
  file_url: string | null
  notes: string | null
  stats: ReportStats | null
  generated_at: string | null
  created_at: string
}

export interface TrafficPair {
  impressions: number
  clicks: number
}

/** Figures behind one generated report: current 30 days vs the 30 days before. */
export interface ReportStats {
  start: string
  end: string
  prevStart: string
  prevEnd: string
  organic: { current: TrafficPair; previous: TrafficPair } | null
  paid: { current: TrafficPair; previous: TrafficPair } | null
  visitors: { current: number; previous: number } | null
  /** Top Search Console queries per period (missing on reports built before 2026-10-09). */
  topQueries?: { current: string[]; previous: string[] } | null
  errors: string[]
}

export interface ReportClient {
  id: string
  customer_id: string
  report_day: number | null
  status: ReportClientStatus
  website: string | null
  notes: string | null
  gsc_site: string | null
  ga4_property_id: string | null
  ads_customer_id: string | null
  ads_campaign_match: string | null
  created_at: string
  updated_at: string
  customer?: Pick<Customer, 'id' | 'name'> | null
}

export interface SeoWorkLog {
  id: string
  report_client_id: string
  period: string
  done_at: string
  items: string[]
  details: string | null
  pages: string[]
  source: 'agent' | 'manual'
  created_at: string
}
