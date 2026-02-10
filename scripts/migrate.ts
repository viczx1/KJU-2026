import { runMigrations, runSeedData, testDatabaseConnection, db } from '../src/lib/db/database';

async function main() {
  console.log('📦 Trafficmaxxers Database Setup (SQLite)\n');
  
  try {
    // Run migrations first
    console.log('📜 Running schema migrations...');
    runMigrations();
    console.log('');

    // Run seed data
    console.log('🌱 Seeding database with Bangalore data...');
    runSeedData();
    console.log('');
    
    // Test connection after migrations
    console.log('🔌 Testing database connection...');
    testDatabaseConnection();
    console.log('');

    // Verify data was inserted
    console.log('🔍 Verifying database...');
    const vehicles = db.getVehicles();
    const zones = db.getZones();
    const incidents = db.getActiveIncidents();
    const fuelStations = db.getFuelStations();
    const environment = db.getEnvironment();

    console.log(`   📦 Vehicles: ${vehicles.length}`);
    console.log(`   🗺️  Zones: ${zones.length}`);
    console.log(`   ⚠️  Incidents: ${incidents.length}`);
    console.log(`   ⛽ Fuel Stations: ${fuelStations.length}`);
    console.log(`   🌦️  Environment: ${environment ? '1' : '0'}`);
    console.log('');

    console.log('🎉 Database setup complete!\n');
    console.log('📍 Next steps:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Open dashboard: http://localhost:3000/dashboard/map');
    console.log('3. Watch vehicles move with AI decisions!');
    console.log('');
    console.log('💾 Database file: trafficmaxxers.db (in project root)');
    console.log('');

  } catch (error: any) {
    console.error('❌ Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run setup
main();
