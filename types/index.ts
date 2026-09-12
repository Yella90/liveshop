export type Profile = {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  role: 'seller' | 'admin'
  created_at: string
}

export type Shop = {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  phone: string | null
  delivery_payer_default: 'CLIENT' | 'SELLER'
  free_delivery_threshold: number | null
  created_at: string
}

export type Product = {
  id: string
  shop_id: string
  name: string
  description: string | null
  base_price: number
  images: string[]
  active: boolean
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  name: string
  price: number
  stock: number
  sku: string | null
  created_at: string
}

export type PublicationSession = {
  id: string
  shop_id: string
  name: string
  slug: string
  description: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  delivery_payer_override: 'CLIENT' | 'SELLER' | null
  free_delivery_enabled: boolean
  created_at: string
}

export type Order = {
  id: string
  shop_id: string
  session_id: string | null
  client_name: string
  client_phone: string
  client_quarter: string | null
  delivery_mode: 'DOMICILE' | 'POINT_RETRAIT' | 'EXPRESS'
  delivery_payer: 'CLIENT' | 'SELLER'
  delivery_visible: 'GRATUITE' | 'PAYANTE'
  products_subtotal: number
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE' | 'LIVREE'
  payment_status: 'NON_PAYE' | 'PAYE_A_LA_LIVRAISON' | 'PAYE_MANUELLEMENT'
  note: string | null
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total: number
}