import axios from 'axios';
import type { Vehicle, TrafficZone, Incident } from '../types';

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = 'qwen/qwen2.5-72b-instruct'; // Fast Qwen model (remove :free suffix)

export interface DecisionContext {
  vehicle: Vehicle;
  nearbyZones: TrafficZone[];
  nearbyIncidents: Incident[];
  environment: {
    weather: string;
    congestion: number;
    rushHour: boolean;
  };
  fuelStations?: Array<{
    name: string;
    distance: number;
    lat: number;
    lng: number;
  }>;
}

export interface AIDecision {
  action: 'continue' | 'reroute' | 'refuel' | 'slow_down' | 'speed_up' | 'rest_break';
  reasoning: string;
  newRoute?: { lat: number; lng: number };
  targetSpeed?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0.0 to 1.0
}

/**
 * AI Agent: Makes human-like driving decisions for a vehicle
 */
export class VehicleAgent {
  private vehicleId: string;
  private personality: 'aggressive' | 'cautious' | 'balanced' | 'efficient';
  private lastDecisionTime: number = 0;
  private decisionCooldown: number = 30000; // 30 seconds between decisions

  constructor(vehicleId: string, personality: 'aggressive' | 'cautious' | 'balanced' | 'efficient' = 'balanced') {
    this.vehicleId = vehicleId;
    this.personality = personality;
  }

  /**
   * Make an AI decision based on current context
   */
  async makeDecision(context: DecisionContext): Promise<AIDecision | null> {
    // Cooldown check
    const now = Date.now();
    if (now - this.lastDecisionTime < this.decisionCooldown) {
      return null; // Too soon to make another decision
    }

    try {
      // Build prompt based on context
      const prompt = this.buildPrompt(context);

      // Call OpenRouter API with Qwen model
      const response = await this.callAI(prompt, context);

      // Parse and validate response
      const decision = this.parseDecision(response, context);

      this.lastDecisionTime = now;
      return decision;
    } catch (error) {
      console.error(`❌ AI decision failed for ${this.vehicleId}:`, error);
      return this.makeFallbackDecision(context);
    }
  }

  /**
   * Build a detailed prompt for the AI model
   */
  private buildPrompt(context: DecisionContext): string {
    const { vehicle, nearbyZones, nearbyIncidents, environment, fuelStations } = context;

    // Personality traits
    const personalityTraits = {
      aggressive: 'You prioritize speed and efficiency, willing to take risks. You prefer the fastest routes.',
      cautious: 'You prioritize safety and fuel economy. You avoid risky maneuvers and prefer slower, safer routes.',
      balanced: 'You balance speed, safety, and cost. You make practical decisions.',
      efficient: 'You optimize for fuel efficiency and cost savings. You plan ahead and avoid unnecessary stops.'
    };

    // Nearby zone summary
    const zoneInfo = nearbyZones.length > 0
      ? nearbyZones.map(z => `${z.name || z.area || z.id} (Congestion: ${z.congestionLevel}%, Avg Speed: ${z.avgSpeed || 'N/A'} km/h)`).join(', ')
      : 'No nearby zones';

    // Incident summary
    const incidentInfo = nearbyIncidents.length > 0
      ? nearbyIncidents.map(i => `${i.type} at ${i.description} (Severity: ${i.severity})`).join(', ')
      : 'No incidents nearby';

    // Fuel station summary
    const fuelInfo = fuelStations && fuelStations.length > 0
      ? `Nearest fuel station: ${fuelStations[0].name} (${Math.round(fuelStations[0].distance / 1000)} km away)`
      : 'No fuel stations nearby';

    const prompt = `You are an AI driver controlling vehicle "${vehicle.name}" (${vehicle.type}) in Bangalore, India.

**Your Personality**: ${personalityTraits[this.personality]}

**Current Situation**:
- Status: ${vehicle.status}
- Location: ${vehicle.location.lat.toFixed(4)}°N, ${vehicle.location.lng.toFixed(4)}°E
- Current Speed: ${vehicle.speed || 0} km/h
- Fuel Level: ${Math.round(vehicle.fuel)}%
- Cargo: ${vehicle.cargoWeight ? `${Math.round(vehicle.cargoWeight)} kg` : 'Empty'}

**Environment**:
- Weather: ${environment.weather}
- Global Traffic Congestion: ${environment.congestion}%
- Rush Hour: ${environment.rushHour ? 'YES' : 'NO'}
- Nearby Zones: ${zoneInfo}
- ${fuelInfo}

**Incidents**:
${incidentInfo}

**Question**: What should you do right now as a human driver in this situation?

Think step by step:
1. Assess your current situation (fuel, speed, cargo, location)
2. Consider environmental factors (weather, traffic, incidents)
3. Make a decision based on your personality and priorities

**Available Actions**:
- CONTINUE: Keep current route and speed
- REROUTE: Change route to avoid traffic/incident (provide reason)
- REFUEL: Go to nearest fuel station
- SLOW_DOWN: Reduce speed due to conditions (provide target speed)
- SPEED_UP: Increase speed on clear road (provide target speed)
- REST_BREAK: Pull over for mandatory break (only for long trips)

Respond in this EXACT format:
ACTION: [action name]
REASONING: [your reasoning in 1-2 sentences]
TARGET_SPEED: [number or N/A]
PRIORITY: [low/medium/high/critical]
CONFIDENCE: [0.0-1.0]`;

    return prompt;
  }

  /**
   * Call OpenRouter AI API
   */
  private async callAI(prompt: string, context: DecisionContext): Promise<string> {
    try {
      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert vehicle driver AI making real-time driving decisions in urban traffic.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      console.log(`🤖 AI Decision for ${this.vehicleId}:`, aiResponse.substring(0, 100) + '...');
      
      return aiResponse;
    } catch (error: any) {
      console.error('❌ OpenRouter API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Parse AI response into structured decision
   */
  private parseDecision(aiResponse: string, context: DecisionContext): AIDecision {
    // Extract action
    const actionMatch = aiResponse.match(/ACTION:\s*(\w+)/i);
    const action = actionMatch ? actionMatch[1].toLowerCase() : 'continue';

    // Extract reasoning
    const reasoningMatch = aiResponse.match(/REASONING:\s*(.+?)(?=TARGET_SPEED:|PRIORITY:|CONFIDENCE:|$)/i);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : 'Continuing current route';

    // Extract target speed
    const speedMatch = aiResponse.match(/TARGET_SPEED:\s*(\d+)/i);
    const targetSpeed = speedMatch ? parseInt(speedMatch[1]) : undefined;

    // Extract priority
    const priorityMatch = aiResponse.match(/PRIORITY:\s*(\w+)/i);
    const priority = (priorityMatch ? priorityMatch[1].toLowerCase() : 'medium') as 'low' | 'medium' | 'high' | 'critical';

    // Extract confidence
    const confidenceMatch = aiResponse.match(/CONFIDENCE:\s*([\d.]+)/i);
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.75;

    // Map action string to valid action type
    const validAction = this.mapAction(action);

    return {
      action: validAction,
      reasoning,
      targetSpeed,
      priority,
      confidence
    };
  }

  /**
   * Map AI response to valid action
   */
  private mapAction(action: string): AIDecision['action'] {
    const actionMap: { [key: string]: AIDecision['action'] } = {
      continue: 'continue',
      reroute: 'reroute',
      refuel: 'refuel',
      slow_down: 'slow_down',
      slowdown: 'slow_down',
      speed_up: 'speed_up',
      speedup: 'speed_up',
      rest_break: 'rest_break',
      rest: 'rest_break',
      break: 'rest_break'
    };

    return actionMap[action] || 'continue';
  }

  /**
   * Fallback decision when AI fails
   */
  private makeFallbackDecision(context: DecisionContext): AIDecision {
    const { vehicle, nearbyIncidents } = context;

    // Critical: Low fuel
    if (vehicle.fuel < 20) {
      return {
        action: 'refuel',
        reasoning: 'Fuel level critical, need to refuel immediately',
        priority: 'critical',
        confidence: 1.0
      };
    }

    // High: Nearby incident
    if (nearbyIncidents.length > 0) {
      const highSeverity = nearbyIncidents.some(i => i.severity === 'high' || (i.severity as any) === 'critical');
      if (highSeverity) {
        return {
          action: 'reroute',
          reasoning: 'High severity incident nearby, rerouting to avoid delay',
          priority: 'high',
          confidence: 0.9
        };
      }
    }

    // Default: Continue
    return {
      action: 'continue',
      reasoning: 'No issues detected, continuing current route',
      priority: 'low',
      confidence: 0.8
    };
  }

  /**
   * Adjust decision cooldown based on urgency
   */
  public setDecisionCooldown(ms: number) {
    this.decisionCooldown = ms;
  }

  /**
   * Get agent personality
   */
  public getPersonality() {
    return this.personality;
  }
}

/**
 * Create AI agent for a vehicle
 */
export function createVehicleAgent(vehicle: Vehicle): VehicleAgent {
  return new VehicleAgent(vehicle.id, (vehicle.aiPersonality || 'balanced') as 'aggressive' | 'cautious' | 'balanced' | 'efficient');
}

/**
 * Test AI API connection
 */
export async function testAIConnection(): Promise<boolean> {
  try {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [{ role: 'user', content: 'Hello, can you hear me?' }],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ AI API (OpenRouter + Qwen) is available');
    return true;
  } catch (error) {
    console.error('❌ AI API unavailable:', error);
    return false;
  }
}
