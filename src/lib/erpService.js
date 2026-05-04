import { supabase } from './supabase'

// ===== CUSTOMERS =====
export async function saveCustomer(customer) {
  try {
    if (customer.id) {
      // Update existing
      const { error } = await supabase
        .from('customers')
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          type: customer.type || 'Retail',
          status: customer.status || 'Active',
          total_spent: customer.totalSpent || 0,
          notes: customer.notes,
          updated_at: new Date(),
        })
        .eq('id', customer.id)
      return { error }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          city: customer.city,
          type: customer.type || 'Retail',
          status: customer.status || 'Active',
          total_spent: customer.totalSpent || 0,
          notes: customer.notes,
        }])
        .select()
      return { data, error }
    }
  } catch (error) {
    console.error('Error saving customer:', error)
    return { error }
  }
}

export async function fetchCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return { data: [], error }
  }
}

export async function deleteCustomer(customerId) {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)
    return { error }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return { error }
  }
}

// ===== SUPPLIERS =====
export async function saveSupplier(supplier) {
  try {
    if (supplier.id) {
      // Update existing
      const { error } = await supabase
        .from('suppliers')
        .update({
          company: supplier.company,
          country: supplier.country,
          contact: supplier.contact,
          email: supplier.email,
          category: supplier.category,
          rating: supplier.rating || 0,
          status: supplier.status || 'Active',
          updated_at: new Date(),
        })
        .eq('id', supplier.id)
      return { error }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          company: supplier.company,
          country: supplier.country,
          contact: supplier.contact,
          email: supplier.email,
          category: supplier.category,
          rating: supplier.rating || 0,
          status: supplier.status || 'Active',
        }])
        .select()
      return { data, error }
    }
  } catch (error) {
    console.error('Error saving supplier:', error)
    return { error }
  }
}

export async function fetchSuppliers() {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return { data: [], error }
  }
}

export async function deleteSupplier(supplierId) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', supplierId)
    return { error }
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return { error }
  }
}

// ===== ORDERS =====
export async function saveOrder(order) {
  try {
    if (order.id && order.id.startsWith('ORD-')) {
      // Update existing
      const { error } = await supabase
        .from('orders')
        .update({
          customer_id: order.customerId,
          customer_name: order.customer,
          order_date: order.date,
          items_count: order.items || 0,
          total: order.total,
          commission: order.commission || 0,
          status: order.status || 'Pending',
          payment_status: order.payment || 'Pending',
          ref_ids: JSON.stringify(order.refIds || []),
          updated_at: new Date(),
        })
        .eq('id', order.id)
      return { error }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          id: order.id || `ORD-${Date.now()}`,
          customer_id: order.customerId,
          customer_name: order.customer,
          order_date: order.date || new Date().toISOString().split('T')[0],
          items_count: order.items || 0,
          total: order.total,
          commission: order.commission || 0,
          status: order.status || 'Pending',
          payment_status: order.payment || 'Pending',
          ref_ids: JSON.stringify(order.refIds || []),
        }])
        .select()
      return { data, error }
    }
  } catch (error) {
    console.error('Error saving order:', error)
    return { error }
  }
}

export async function fetchOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('order_date', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return { data: [], error }
  }
}

export async function deleteOrder(orderId) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
    return { error }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { error }
  }
}

// ===== STOCK MOVEMENTS =====
export async function saveMovement(movement) {
  try {
    const { data, error } = await supabase
      .from('stock_movements')
      .insert([{
        movement_date: movement.date || new Date().toISOString().split('T')[0],
        movement_type: movement.type, // IN or OUT
        ref_id: movement.refId,
        brand: movement.brand,
        quantity: movement.quantity || 1,
        reason: movement.reason,
        user_name: movement.userName,
      }])
      .select()
    return { data, error }
  } catch (error) {
    console.error('Error saving movement:', error)
    return { error }
  }
}

export async function fetchMovements() {
  try {
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .order('movement_date', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching movements:', error)
    return { data: [], error }
  }
}

// ===== INVENTORY =====
export async function saveInventory(item) {
  try {
    if (item.id) {
      // Update existing
      const { error } = await supabase
        .from('inventory')
        .update({
          ref_id: item.refId,
          brand: item.brand,
          model: item.model,
          serial_no: item.serialNo,
          condition: item.condition,
          year: item.year,
          cost_price: item.costPrice || 0,
          sale_price: item.salePrice || 0,
          commission: item.commission || 0,
          actor_fee: item.actorFee || 0,
          owner: item.owner,
          owner_contact: item.ownerContact,
          status: item.status || 'Active',
          type: item.type || 'Personal',
          updated_at: new Date(),
        })
        .eq('id', item.id)
      return { error }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          ref_id: item.refId,
          brand: item.brand,
          model: item.model,
          serial_no: item.serialNo,
          condition: item.condition,
          year: item.year,
          cost_price: item.costPrice || 0,
          sale_price: item.salePrice || 0,
          commission: item.commission || 0,
          actor_fee: item.actorFee || 0,
          owner: item.owner,
          owner_contact: item.ownerContact,
          status: item.status || 'Active',
          type: item.type || 'Personal',
        }])
        .select()
      return { data, error }
    }
  } catch (error) {
    console.error('Error saving inventory:', error)
    return { error }
  }
}

export async function fetchInventory() {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })
    return { data: data || [], error }
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return { data: [], error }
  }
}

export async function deleteInventory(itemId) {
  try {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', itemId)
    return { error }
  } catch (error) {
    console.error('Error deleting inventory:', error)
    return { error }
  }
}
