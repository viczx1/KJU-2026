# Trafficmaxxers AI-Powered Traffic Simulation

## 🎯 Architecture Overview

We've implemented a complete AI-driven traffic simulation system with three major layers:

### **1. Database Layer** (PostgreSQL via Neon)
- **Schema**: 9 tables for vehicles, zones, incidents, routes, AI decisions, history, environment, fuel stations
- **Migration**: `src/lib/db/schema.sql` - Run this to set up the database
- **Seed Data**: `src/lib/db/seed.sql` - Populates Bangalore-specific data (14 vehicles, 12 zones, 6 fuel stations, 3 incidents)
- **Client**: `src/lib/db/database.ts` - Helper functions for all database operations

### **2. Simulation Layer**
- **OSRM Routing**: `src/lib/routing/osrmService.ts` - Real road-based routing using OpenStreetMap data
  - Gets actual routes between points
  - Calculates realistic travel times
  - Snaps vehicles to roads
  - Estimates fuel consumption
  - Fallback to straight-line routes when offline

- **Environment Engine**: `src/lib/simulation/environmentEngine.ts` - Weather & traffic simulation
  - Dynamic weather: Clear → Cloudy → Rain → Storm (with transitions)
  - Rush hour detection (7-10 AM, 5-9 PM)
  - Global congestion calculation based on time + weather
  - Speed factors (weather × congestion affects vehicle speed)
  - Random incident spawning

### **3. AI Agent Layer**
- **Vehicle Agent**: `src/lib/ai/vehicleAgent.ts` - Qwen-powered decision making
  - Each vehicle has an AI "brain" with personality (aggressive/cautious/balanced/efficient)
  - Makes decisions every 30 seconds
  - Actions: continue, reroute, refuel, slow_down, speed_up, rest_break
  - Considers: fuel level, weather, traffic, incidents, cargo weight
  - Uses OpenRouter API with `qwen/qwen2.5-72b-instruct:free` model

## 📊 Data Flow

```
Frontend (React)
    ↓
TrafficContext (polling every 3s)
    ↓
API Routes (/api/simulation, /api/vehicles)
    ↓
PostgreSQL Database (Neon) ← Single source of truth
    ↑
SimulationController (updates every 2s)
    ↑
├─ OSRM Service (road routing)
├─ Environment Engine (weather/traffic)
└─ AI Agents (decisions for each vehicle)
```

## 🗄️ Database Schema

### **vehicles**
- Location (lat/lng), speed, heading, fuel, cargo
- Route tracking (current_route_id, waypoint_index)
- AI personality & last decision time

### **routes**
- Start/end coordinates
- OSRM waypoints (stored as JSONB array)
- Total distance & duration
- Status tracking

### **ai_decisions**
- Logs every AI decision
- Context (vehicle state + environment)
- Model prompt & response
- Decision taken & confidence score

### **zones**
- 12 Bangalore areas (Silk Board, Whitefield, Electronic City, etc.)
- Real-time congestion & vehicle count
- Zone type (urban/highway/industrial)

### **incidents**
- Type, severity, location
- Affected radius & speed reduction factor
- Auto-generated based on weather/traffic

### **environment**
- Current weather, temperature, visibility
- Simulation time (can run faster than real-time)
- Global congestion level & rush hour status

## 🚀 Setup Instructions

### Step 1: Create PostgreSQL Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project: "Trafficmaxxers"
3. Copy connection string (starts with `postgresql://`)
4. Create `.env.local` in project root:

```bash
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
OPENROUTER_API_KEY=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
```

### Step 2: Run Migrations

Create a script `scripts/migrate.ts`:

```typescript
import { runMigrations, runSeedData } from '../src/lib/db/database';

async function main() {
  console.log('🔄 Running migrations...');
  await runMigrations();
  
  console.log('🌱 Seeding database...');
  await runSeedData();
  
  console.log('✅ Database ready!');
}

main().catch(console.error);
```

Run: `npx tsx scripts/migrate.ts`

### Step 3: Update Environment Variables

Add to `.env.local`:
- `DATABASE_URL` - Your Neon connection string
- `OPENROUTER_API_KEY` - Already hardcoded in vehicleAgent.ts

## 🛠️ Next Steps (In Progress)

### ✅ Completed
1. Database schema & migrations
2. OSRM routing service (real roads)
3. AI agent system (Qwen integration)
4. Environment engine (weather/traffic)

### 🔄 TODO
5. **Update SimulationController** - Use OSRM routes instead of random walk
6. **Add smooth map animations** - Interpolate marker movement
7. **Restructure API routes** - Query PostgreSQL instead of in-memory state
8. **Update TrafficContext** - Remove dual state, use database as single source
9. **Fix stats display** - Calculate from database

## 🎮 How It Works

### Vehicle Lifecycle

1. **Spawn**: Vehicle created in database with random Bangalore location
2. **Route Planning**: OSRM calculates road-based route to destination
3. **Movement**: SimulationController moves vehicle along waypoints at realistic speed
4. **AI Decisions**: Every 30s, AI agent checks context and makes decision
5. **State Updates**: Location/fuel/speed updated in database every 2s
6. **Frontend Sync**: TrafficContext polls API every 3s, updates map markers

### AI Decision Example

```
Context:
- Vehicle: FLEET-001 (truck)
- Fuel: 45%
- Location: Silk Board (high congestion)
- Weather: Heavy rain
- Incident: Accident 500m ahead

AI Prompt → Qwen Model → Decision:
ACTION: REROUTE
REASONING: Accident ahead with heavy rain will cause 30min delay. Taking alternate route via Hosur Road.
PRIORITY: high
CONFIDENCE: 0.85
```

## 📈 Performance Optimizations

- **Database indexes** on location, status, time fields
- **Parallel route calculations** for multiple vehicles
- **Caching** of OSRM routes (reuse common routes)
- **Rate limiting** on AI API calls (30s cooldown per vehicle)
- **Batch updates** instead of individual queries

## 🔍 Monitoring

Check database with:
```sql
-- Active vehicles
SELECT id, name, status, fuel, speed FROM vehicles WHERE status != 'idle';

-- Recent AI decisions
SELECT vehicle_id, decision_type, decision_taken, confidence 
FROM ai_decisions 
ORDER BY decided_at DESC 
LIMIT 10;

-- Current environment
SELECT condition, temperature, global_congestion_level, rush_hour 
FROM environment 
ORDER BY updated_at DESC 
LIMIT 1;
```

## 🐛 Troubleshooting

### "DATABASE_URL not configured"
- Make sure `.env.local` exists with DATABASE_URL
- Restart dev server after adding env vars

### "OSRM API timeout"
- Fallback to straight-line routes (automatic)
- Check internet connection
- Consider self-hosting OSRM for reliability

### "OpenRouter API error"
- Check API key is valid
- Model `qwen/qwen2.5-72b-instruct:free` has rate limits
- Fallback decisions kick in automatically

## 🎨 Visual Features (Coming)

- Smooth vehicle marker animations (2s interpolation)
- Route polylines on map (show planned path)
- Weather overlay (rain/fog effects)
- Heat map for congestion
- AI decision indicators (speech bubbles)

---

**Current Status**: Core architecture complete, ready to integrate with frontend.
**Next**: Update SimulationController and API routes to use new system.
