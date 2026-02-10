-- Seed data for Trafficmaxxers Bangalore simulation
-- Run this after schema.sql

-- Initialize environment
INSERT INTO environment (sim_time, condition, temperature, global_congestion_level, rush_hour)
VALUES (NOW(), 'clear', 28.5, 30, FALSE)
ON CONFLICT DO NOTHING;

-- Fuel stations in key Bangalore locations
INSERT INTO fuel_stations (id, name, location_lat, location_lng, fuel_price, capacity) VALUES
('FS-001', 'Silk Board Fuel Station', 12.9172, 77.6229, 105.50, 4),
('FS-002', 'Electronic City Petrol Pump', 12.8456, 77.6603, 103.20, 6),
('FS-003', 'Whitefield Highway Fuel', 12.9698, 77.7499, 106.80, 5),
('FS-004', 'Bannerghatta Road Station', 12.8930, 77.5960, 104.50, 3),
('FS-005', 'Hebbal Flyover Fuel', 13.0358, 77.5970, 107.20, 4),
('FS-006', 'Airport Road Petrol', 13.1986, 77.7066, 108.90, 5)
ON CONFLICT (id) DO NOTHING;

-- Traffic zones (major areas in Bangalore)
INSERT INTO zones (id, name, center_lat, center_lng, radius_meters, congestion_level, avg_speed, zone_type) VALUES
('ZONE-SILK', 'Silk Board Junction', 12.9172, 77.6229, 1500, 75, 18, 'urban'),
('ZONE-ECITY', 'Electronic City', 12.8456, 77.6603, 2000, 45, 35, 'industrial'),
('ZONE-WHITE', 'Whitefield', 12.9698, 77.7499, 2500, 50, 32, 'commercial'),
('ZONE-KORAM', 'Koramangala', 12.9279, 77.6271, 1200, 65, 22, 'commercial'),
('ZONE-INDIRA', 'Indiranagar', 12.9719, 77.6412, 1300, 60, 25, 'residential'),
('ZONE-JAYNR', 'Jayanagar', 12.9250, 77.5838, 1800, 55, 28, 'residential'),
('ZONE-MGRD', 'MG Road', 12.9750, 77.6060, 1000, 70, 20, 'commercial'),
('ZONE-MALYA', 'Malleshwaram', 13.0030, 77.5710, 1500, 50, 30, 'residential'),
('ZONE-HEBBL', 'Hebbal', 13.0358, 77.5970, 1600, 60, 26, 'urban'),
('ZONE-YSHPT', 'Yeshwanthpur', 13.0280, 77.5385, 1400, 55, 28, 'industrial'),
('ZONE-BTMLY', 'BTM Layout', 12.9165, 77.6101, 1300, 65, 23, 'residential'),
('ZONE-AIRPT', 'Kempegowda Airport', 13.1986, 77.7066, 3000, 25, 60, 'highway')
ON CONFLICT (id) DO NOTHING;

-- Initial vehicle fleet (mix of trucks, cars, vans)
INSERT INTO vehicles (id, name, type, status, location_lat, location_lng, fuel, cargo_capacity, ai_personality, heading, speed) VALUES
-- Trucks (heavy cargo)
('FLEET-001', 'Ashok Leyland Truck Alpha', 'truck', 'in-transit', 12.9716, 77.5946, 78, 15000, 'efficient', 45, 32),
('FLEET-002', 'Tata Prima Beta', 'truck', 'in-transit', 12.8500, 77.6600, 65, 18000, 'cautious', 120, 28),
('FLEET-003', 'Mahindra Blazo Gamma', 'truck', 'loading', 12.9698, 77.7499, 92, 16000, 'balanced', 0, 0),
('FLEET-004', 'Eicher Pro Delta', 'truck', 'in-transit', 12.9172, 77.6229, 45, 12000, 'aggressive', 200, 38),
('FLEET-005', 'BharatBenz Epsilon', 'truck', 'refueling', 13.0358, 77.5970, 12, 17000, 'efficient', 0, 0),
('FLEET-006', 'Volvo FH16 Zeta', 'truck', 'in-transit', 12.9250, 77.5838, 88, 20000, 'balanced', 315, 42),

-- Vans (medium cargo)
('VAN-101', 'Force Traveller V1', 'van', 'in-transit', 12.9279, 77.6271, 70, 3500, 'aggressive', 90, 45),
('VAN-102', 'Mahindra Supro V2', 'van', 'loading', 12.9719, 77.6412, 85, 3000, 'balanced', 0, 0),
('VAN-103', 'Tata Winger V3', 'van', 'in-transit', 12.9750, 77.6060, 55, 3200, 'cautious', 180, 38),
('VAN-104', 'Maruti Eeco V4', 'van', 'in-transit', 13.0030, 77.5710, 92, 2800, 'efficient', 270, 52),

-- Cars (light cargo/courier)
('CAR-201', 'Swift Dzire Express', 'car', 'in-transit', 12.9165, 77.6101, 68, 500, 'aggressive', 135, 58),
('CAR-202', 'Honda City Courier', 'car', 'in-transit', 13.1986, 77.7066, 75, 480, 'balanced', 225, 62),
('CAR-203', 'Hyundai Verna Quick', 'car', 'idle', 12.8456, 77.6603, 82, 520, 'cautious', 0, 0),
('CAR-204', 'Toyota Etios Rush', 'car', 'in-transit', 12.9698, 77.7499, 48, 490, 'aggressive', 60, 65)
ON CONFLICT (id) DO NOTHING;

-- Initial incidents (realistic Bangalore traffic scenarios)
INSERT INTO incidents (id, type, severity, location_lat, location_lng, affected_radius_meters, status, description, speed_reduction_factor) VALUES
('INC-001', 'accident', 'high', 12.9172, 77.6229, 800, 'active', 'Multi-vehicle collision at Silk Board Junction, 2 lanes blocked', 0.3),
('INC-002', 'construction', 'medium', 12.9750, 77.6060, 500, 'active', 'Metro construction work on MG Road, single lane traffic', 0.6),
('INC-003', 'congestion', 'low', 13.0358, 77.5970, 600, 'active', 'Heavy traffic near Hebbal Flyover during evening hours', 0.7)
ON CONFLICT (id) DO NOTHING;

-- Update zone vehicle counts (initial)
UPDATE zones SET vehicle_count = (
    SELECT COUNT(*) FROM vehicles v 
    WHERE SQRT(POWER((v.location_lat - zones.center_lat) * 111000, 2) + 
               POWER((v.location_lng - zones.center_lng) * 111000, 2)) < zones.radius_meters
);
