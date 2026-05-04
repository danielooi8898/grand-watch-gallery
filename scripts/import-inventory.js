/**
 * Import existing inventory data from inventoryData.js into Supabase
 * Run with: node scripts/import-inventory.js
 */

import { createClient } from '@supabase/supabase-js'
import { INVENTORY_DATA } from '../src/data/inventoryData.js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importInventory() {
  console.log(`📦 Importing ${INVENTORY_DATA.length} inventory items...`)

  let successCount = 0
  let errorCount = 0
  const errors = []

  for (const item of INVENTORY_DATA) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          ref_id: item.refId,
          brand: item.brand,
          model: item.model,
          serial_no: item.serialNo,
          condition: item.condition || 'NEW',
          year: item.year,
          cost_price: item.costPrice || 0,
          sale_price: item.salePrice || 0,
          commission: item.commission || 0,
          actor_fee: item.actorFee || 0,
          owner: item.owner || null,
          owner_contact: item.ownerContact || null,
          status: item.status || 'Active',
          type: item.type || 'Personal',
        }])
        .select()

      if (error) {
        errorCount++
        errors.push(`${item.refId}: ${error.message}`)
      } else {
        successCount++
        if (successCount % 50 === 0) {
          console.log(`  ✅ Imported ${successCount} items...`)
        }
      }
    } catch (err) {
      errorCount++
      errors.push(`${item.refId}: ${err.message}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Successfully imported: ${successCount} items`)
  console.log(`❌ Failed to import: ${errorCount} items`)
  console.log('='.repeat(50))

  if (errors.length > 0 && errors.length <= 10) {
    console.log('\nErrors:')
    errors.forEach(err => console.log(`  - ${err}`))
  } else if (errors.length > 10) {
    console.log(`\nFirst 10 errors (${errors.length} total):`)
    errors.slice(0, 10).forEach(err => console.log(`  - ${err}`))
  }

  process.exit(errorCount > 0 ? 1 : 0)
}

importInventory()
