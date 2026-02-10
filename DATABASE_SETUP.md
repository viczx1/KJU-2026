# 🗄️ Database Setup Guide

## Step 1: Create Neon Database

1. **Go to Neon Console**: https://console.neon.tech/
2. **Sign in** with GitHub, Google, or email
3. **Create new project**:
   - Name: `Trafficmaxxers`
   - Region: Choose closest to you (e.g., AWS US East)
   - PostgreSQL version: 16 (default)
4. **Wait for project creation** (~10 seconds)

## Step 2: Copy Connection String

After project is created, you'll see a connection string like this:

```
postgresql://username:password@ep-something-123.region.neon.tech/neondb?sslmode=require
```

**Copy this entire string** (click the copy icon)

## Step 3: Create Environment File

In your project root (`D:\KJU\trafficmaxxers\`), create a file named `.env.local`:

```bash
# .env.local
DATABASE_URL=postgresql://username:password@ep-something-123.region.neon.tech/neondb?sslmode=require
OPENROUTER_API_KEY=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
```

**Important**: Replace the DATABASE_URL value with YOUR actual connection string from Neon!

## Step 4: Run Migrations

Open terminal and run:

```powershell
npm run db:migrate
```

This will:
- ✅ Connect to your Neon database
- ✅ Create 9 tables (vehicles, zones, incidents, routes, etc.)
- ✅ Insert seed data (14 vehicles, 12 Bangalore zones, 6 fuel stations)
- ✅ Verify the data was inserted correctly

**Expected output:**
```
🔌 Connecting to database...
✅ Connected to PostgreSQL
📜 Running schema migrations...
✅ Schema created (XX statements executed)
🌱 Seeding database with Bangalore data...
✅ Seed data inserted (XX statements executed)
🔍 Verifying database...
   📦 Vehicles: 14
   🗺️  Zones: 12
   ⚠️  Incidents: 3
   ⛽ Fuel Stations: 6
   🌦️  Environment: 1
🎉 Database setup complete!
```

## Step 5: Verify in Neon Console

Go back to https://console.neon.tech/ and:

1. Click on your **Trafficmaxxers** project
2. Click **Tables** in the sidebar
3. You should see 9 tables:
   - vehicles
   - zones
   - incidents
   - routes
   - ai_decisions
   - vehicle_history
   - environment
   - fuel_stations

4. Click on **vehicles** table → **Data** to see the 14 vehicles

## Troubleshooting

### Error: "DATABASE_URL not set"
- Make sure `.env.local` exists in project root
- Check that the file is named exactly `.env.local` (not `.env.local.txt`)
- Restart your terminal/VS Code after creating the file

### Error: "Connection refused" or "timeout"
- Check your internet connection
- Make sure the Neon connection string is correct
- Verify SSL mode is set: `?sslmode=require`

### Error: "permission denied" or "relation already exists"
- This is normal if you run migrations twice
- The script handles this gracefully
- Your data is safe!

## Next Steps

Once migrations are complete, you're ready to update the application code to use the database!

Run:
```powershell
npm run dev
```

Then navigate to http://localhost:3000/dashboard/map and watch the magic! 🚀
