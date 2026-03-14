export interface Profile {
  id: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  name: string
  registration_number: string
  brand: string | null
  model: string | null
  year: number | null
  current_odometer: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Trip {
  id: string
  user_id: string
  vehicle_id: string
  date: string
  start_time: string | null
  end_time: string | null
  driver_name: string | null
  odometer_start: number
  odometer_end: number
  distance: number
  start_location: string | null
  destination: string | null
  purpose: string | null
  category: 'private' | 'business'
  notes: string | null
  created_at: string
  updated_at: string
  vehicle?: Vehicle
}

export type TripCategory = Trip['category']
