-- Trafficmaxxers Database Schema
-- PostgreSQL (Neon) schema for AI-powered traffic simulation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial data (optional but recommended)

-- Vehicles table: Core vehicle data
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('truck', 'car', 'van')),
    status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('idle', 'in-transit', 'loading', 'unloading', 'refueling', 'maintenance')),
    
    -- Location data
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    heading DECIMAL(5, 2) DEFAULT 0, -- Direction in degrees (0-360)
    
    -- Vehicle state
    speed DECIMAL(5, 2) DEFAULT 0, -- km/h
    fuel DECIMAL(5, 2) DEFAULT 100, -- Percentage
    cargo_weight DECIMAL(10, 2) DEFAULT 0, -- kg
    cargo_capacity DECIMAL(10, 2) DEFAULT 5000, -- kg
    
    -- Route information
    current_route_id VARCHAR(50),
    waypoint_index INTEGER DEFAULT 0,
    destination_lat DECIMAL(10, 8),
    destination_lng DECIMAL(11, 8),
    
    -- AI agent data
    last_ai_decision TIMESTAMP DEFAULT NOW(),
    ai_personality VARCHAR(20) DEFAULT 'balanced' CHECK (ai_personality IN ('aggressive', 'cautious', 'balanced', 'efficient')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Traffic zones table: Areas with different traffic conditions
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    
    -- Boundary (simplified as center + radius)
    center_lat DECIMAL(10, 8) NOT NULL,
    center_lng DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER DEFAULT 1000,
    
    -- Traffic conditions
    congestion_level INTEGER DEFAULT 0 CHECK (congestion_level BETWEEN 0 AND 100),
    avg_speed DECIMAL(5, 2) DEFAULT 40, -- km/h
    vehicle_count INTEGER DEFAULT 0,
    
    -- Zone attributes
    zone_type VARCHAR(30) DEFAULT 'urban' CHECK (zone_type IN ('urban', 'highway', 'industrial', 'residential', 'commercial')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Incidents table: Traffic incidents affecting routes
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('accident', 'construction', 'congestion', 'weather', 'breakdown')),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Location
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    affected_radius_meters INTEGER DEFAULT 500,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'reported')),
    description TEXT,
    
    -- Impact
    speed_reduction_factor DECIMAL(3, 2) DEFAULT 0.5, -- 0.0 to 1.0
    
    -- Timestamps
    reported_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Routes table: Precomputed routes from OSRM
CREATE TABLE IF NOT EXISTS routes (
    id VARCHAR(50) PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Start/End points
    start_lat DECIMAL(10, 8) NOT NULL,
    start_lng DECIMAL(11, 8) NOT NULL,
    end_lat DECIMAL(10, 8) NOT NULL,
    end_lng DECIMAL(11, 8) NOT NULL,
    
    -- Route data (stored as JSON array of waypoints)
    waypoints JSONB NOT NULL, -- Array of {lat, lng, distance, duration}
    total_distance_meters INTEGER NOT NULL,
    estimated_duration_seconds INTEGER NOT NULL,
    
    -- Route metadata
    route_type VARCHAR(20) DEFAULT 'fastest' CHECK (route_type IN ('fastest', 'shortest', 'balanced', 'scenic')),
    avoid_tolls BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- AI decisions table: Log of all AI agent decisions
CREATE TABLE IF NOT EXISTS ai_decisions (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Decision context
    decision_type VARCHAR(30) NOT NULL CHECK (decision_type IN ('route_choice', 'speed_adjustment', 'fuel_stop', 'incident_response', 'load_balance', 'rest_break')),
    
    -- Input state
    context JSONB NOT NULL, -- Vehicle state, environment, nearby incidents
    
    -- AI model response
    model_name VARCHAR(50) DEFAULT 'qwen/qwen2.5-72b-instruct',
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    decision_taken VARCHAR(100) NOT NULL,
    
    -- Outcome
    confidence DECIMAL(3, 2), -- 0.0 to 1.0
    execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'executed', 'failed', 'overridden')),
    
    -- Timestamps
    decided_at TIMESTAMP DEFAULT NOW(),
    executed_at TIMESTAMP
);

-- Vehicle history table: Position tracking for analytics
CREATE TABLE IF NOT EXISTS vehicle_history (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- Snapshot of vehicle state
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) NOT NULL,
    fuel DECIMAL(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    
    -- Contextual data
    zone_id VARCHAR(50),
    traffic_congestion INTEGER,
    weather_condition VARCHAR(20),
    
    -- Timestamp
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Environment state table: Weather and global conditions
CREATE TABLE IF NOT EXISTS environment (
    id SERIAL PRIMARY KEY,
    
    -- Weather
    condition VARCHAR(30) DEFAULT 'clear' CHECK (condition IN ('clear', 'cloudy', 'rain', 'heavy_rain', 'fog', 'storm')),
    temperature DECIMAL(4, 1), -- Celsius
    visibility_meters INTEGER DEFAULT 10000,
    wind_speed DECIMAL(4, 1), -- km/h
    
    -- Time simulation
    sim_time TIMESTAMP NOT NULL,
    time_multiplier DECIMAL(4, 2) DEFAULT 1.0, -- 1.0 = real-time, 10.0 = 10x speed
    
    -- Global traffic state
    global_congestion_level INTEGER DEFAULT 20 CHECK (global_congestion_level BETWEEN 0 AND 100),
    rush_hour BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Fuel stations table: Locations where vehicles can refuel
CREATE TABLE IF NOT EXISTS fuel_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    
    -- Location
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    
    -- Station attributes
    fuel_price DECIMAL(6, 2) DEFAULT 100.0, -- Rs per liter
    capacity INTEGER DEFAULT 5, -- Number of vehicles that can refuel simultaneously
    current_queue INTEGER DEFAULT 0,
    
    -- Status
    operational BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_zones_location ON zones(center_lat, center_lng);
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_routes_vehicle ON routes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_vehicle ON ai_decisions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_history_vehicle ON vehicle_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_history_time ON vehicle_history(recorded_at);
CREATE INDEX IF NOT EXISTS idx_fuel_stations_location ON fuel_stations(location_lat, location_lng);

-- Trigger to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_environment_updated_at BEFORE UPDATE ON environment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fuel_stations_updated_at BEFORE UPDATE ON fuel_stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
