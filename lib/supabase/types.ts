export type Role = 'admin' | 'customer'
export type CustomerStatus = 'active' | 'paused' | 'inactive'
export type ProjectStatus = 'active' | 'completed' | 'paused' | 'cancelled'
export type BillingInterval = 'monthly' | 'quarterly' | 'yearly'

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
