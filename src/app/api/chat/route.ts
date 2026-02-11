import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(request: NextRequest) {
    try {
        if (!OPENROUTER_API_KEY) {
            return NextResponse.json(
                { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env file. Get a free key from https://openrouter.ai/keys' },
                { status: 500 }
            );
        }

        const { messages, trafficData } = await request.json();

        // Limit to last 6 messages for faster processing
        const recentMessages = messages.slice(-6);
        
        // Summarize traffic data instead of sending raw JSON
        const summarizeTrafficData = (data: any) => {
            if (!data) return 'No real-time data available.';
            
            const vehicleCount = data.vehicles?.length || 0;
            const activeVehicles = data.vehicles?.filter((v: any) => v.status === 'active')?.length || 0;
            const lowFuelVehicles = data.vehicles?.filter((v: any) => v.fuel < 30)?.map((v: any) => v.name) || [];
            
            const zoneCount = data.zones?.length || 0;
            const congestedZones = data.zones?.filter((z: any) => z.congestion > 0.7)?.map((z: any) => z.name) || [];
            
            const incidentCount = data.incidents?.length || 0;
            const activeIncidents = data.incidents?.slice(0, 3)?.map((i: any) => `${i.type} at ${i.location?.name || 'unknown location'}`) || [];
            
            return `Fleet: ${activeVehicles}/${vehicleCount} vehicles active. ${lowFuelVehicles.length > 0 ? `Low fuel: ${lowFuelVehicles.join(', ')}. ` : ''}Zones: ${zoneCount} monitored${congestedZones.length > 0 ? `, congested: ${congestedZones.join(', ')}` : ''}. Incidents: ${incidentCount}${activeIncidents.length > 0 ? ` (${activeIncidents.join('; ')})` : ''}.`;
        };

        // Build concise system context
        const systemContext = `You are TrafficMaxxer AI, a Bangalore traffic routing expert. Be helpful, concise but thorough.

Expertise: Real-time routing, fleet management, congestion prediction, Bangalore roads.

Current Status: ${summarizeTrafficData(trafficData)}

Guidelines:
- Use markdown: **bold**, lists for clarity
- Give specific, actionable advice
- Reference current traffic conditions when relevant`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'TrafficMaxxers'
            },
            body: JSON.stringify({
                model: 'z-ai/glm-4.5-air:free',
                messages: [
                    { role: 'system', content: systemContext },
                    ...recentMessages
                ],
                temperature: 0.5,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API Error:', errorData);
            
            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Invalid API key. Please get a new API key from https://openrouter.ai/keys and update OPENROUTER_API_KEY in your .env file.' },
                    { status: 401 }
                );
            }
            
            throw new Error(`OpenRouter API failed: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ 
            message: data.choices[0]?.message?.content || 'No response generated.'
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
