# Activity Logging System

The activity logging system tracks all actions performed in the admin portal, including logins, logouts, and content modifications.

## Setup

### 1. Create the Database Table

Run the SQL migration to create the `activity_logs` table in Supabase:

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy and paste the contents of: migrations/001_create_activity_logs_table.sql
# 3. Run the query
```

Or via SQL Editor in Supabase Dashboard:
```sql
-- Copy from migrations/001_create_activity_logs_table.sql
```

### 2. Environment Variables

No additional environment variables needed. The system uses the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Usage

### Quick Start - useActivityLog Hook

The easiest way to log activities from React components:

```javascript
'use client'
import { useActivityLog } from '@/hooks/useActivityLog'

export default function MyComponent() {
  const { logAction } = useActivityLog()

  const handleSave = async (data) => {
    // ... save the data ...
    
    // Log the activity
    await logAction({
      action: 'update',
      category: 'collection',
      targetId: data.id,
      targetName: data.name,
      changes: {
        before: oldData,
        after: data
      }
    })
  }

  return <button onClick={() => handleSave(data)}>Save</button>
}
```

### Direct API Usage

For server-side or non-React code:

```javascript
import { logActivity } from '@/lib/activityLogger'

await logActivity({
  action: 'delete',
  category: 'blog',
  userEmail: 'user@example.com',
  targetId: '123',
  targetName: 'Post Title',
  changes: null,
  details: { reason: 'spam' }
})
```

## Parameters

- **action** (required): Type of action performed
  - `login`, `logout`, `create`, `update`, `delete`, `view`, `export`, `import`, `publish`, `draft`, `archive`
  
- **category** (required): Category of the resource
  - `auth`, `collection`, `blog`, `enquiries`, `leads`, `settings`, `content`, `erp`, `traffic`
  
- **userEmail** (required): Email of the user performing the action

- **targetId** (optional): ID of the resource being acted upon

- **targetName** (optional): Human-readable name of the resource

- **changes** (optional): Object describing what was changed
  ```javascript
  {
    before: { name: 'Old Name', price: 100 },
    after: { name: 'New Name', price: 150 }
  }
  ```

- **details** (optional): Additional context
  ```javascript
  {
    reason: 'price adjustment',
    notes: 'Quarterly review'
  }
  ```

## Examples

### Logging Collection Updates

```javascript
const { logAction } = useActivityLog()

const updateWatch = async (watchId, updates) => {
  const oldWatch = await fetchWatch(watchId)
  
  // Update the watch
  await db.watches.update(watchId, updates)
  
  // Log the activity
  await logAction({
    action: 'update',
    category: 'collection',
    targetId: watchId,
    targetName: updates.model || oldWatch.model,
    changes: {
      before: oldWatch,
      after: { ...oldWatch, ...updates }
    }
  })
}
```

### Logging Blog Posts

```javascript
const { logAction } = useActivityLog()

const publishPost = async (postId, title) => {
  await db.posts.update(postId, { status: 'published' })
  
  await logAction({
    action: 'publish',
    category: 'blog',
    targetId: postId,
    targetName: title
  })
}
```

### Logging Enquiries

```javascript
const { logAction } = useActivityLog()

const markEnquiryAsRead = async (enquiryId, customerEmail) => {
  await db.enquiries.update(enquiryId, { is_read: true })
  
  await logAction({
    action: 'view',
    category: 'enquiries',
    targetId: enquiryId,
    targetName: customerEmail
  })
}
```

## Viewing Activities

Access the Activity Log at `/admin/activity` in the admin portal.

Features:
- Filter by category, user email, and action type
- Search and pagination
- Detailed timestamp information
- View what was changed (via changes column)

## Database Schema

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  target_id VARCHAR(255),
  target_name VARCHAR(500),
  changes JSONB,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT
)
```

### Indexes
- `user_email` - fast lookup by user
- `category` - fast lookup by category
- `action` - fast lookup by action type
- `created_at` - sorted by timestamp
- `user_email, category` - combined queries

## Maintenance

### Clean Up Old Logs

The system includes a cleanup function to remove logs older than 90 days:

```javascript
import { cleanupOldActivities } from '@/lib/activityLogger'

// Remove logs older than 90 days
await cleanupOldActivities(90)

// Remove logs older than 30 days
await cleanupOldActivities(30)
```

## Best Practices

1. **Always include category**: Use the correct category to make filtering easier
2. **Use meaningful names**: The `targetName` should be human-readable
3. **Log changes**: For update operations, include `changes` object showing before/after states
4. **Be consistent**: Use consistent action names across the app
5. **Think about privacy**: Don't log sensitive information (passwords, tokens, etc.)
6. **Include context**: Use `details` to add extra context about why something happened

## Security

- Row-level security is enabled - all authenticated users can read activity logs
- Activity logs cannot be deleted (audit trail integrity)
- Only inserts and reads are allowed on the activity_logs table
- Consider restricting access to the activity log page based on user roles

## Troubleshooting

### Activities not logging?

1. Ensure the `activity_logs` table exists in Supabase
2. Check that user is authenticated (`user?.email` is set)
3. Check browser console for errors
4. Verify Supabase credentials in `.env.local`

### Performance issues?

1. Old logs slow down queries - run cleanup function periodically
2. Consider archiving logs older than 6 months
3. Increase indexes on frequently queried columns
