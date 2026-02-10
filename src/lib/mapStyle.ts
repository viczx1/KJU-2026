export const mapStyle = {
    "version": 8,
    "name": "TrafficMaxxers Dark",
    "metadata": {},
    "sources": {
        "openmaptiles": {
            "type": "vector",
            "tiles": [
                "http://localhost:3000/api/tiles/{z}/{x}/{y}"
            ],
            "minzoom": 0,
            "maxzoom": 14 // Assuming standard max zoom for OSM vector tiles
        }
    },
    // Use MapLibre demo glyphs which are reliable and free
    "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#0B0E14"
            }
        },
        {
            "id": "landuse",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landuse",
            "filter": ["==", "class", "park"],
            "paint": {
                "fill-color": "#1e293b",
                "fill-opacity": 0.3
            }
        },
        {
            "id": "landuse_residential",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "landuse",
            "filter": ["==", "class", "residential"],
            "paint": {
                "fill-color": "#0f172a",
                "fill-opacity": 0.5
            }
        },
        {
            "id": "water",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "water",
            "paint": {
                "fill-color": "#1e3a8a",
                "fill-opacity": 0.4
            }
        },
        {
            "id": "building",
            "type": "fill",
            "source": "openmaptiles",
            "source-layer": "building",
            "paint": {
                "fill-color": "#1e293b",
                "fill-opacity": 0.8,
                "fill-outline-color": "#334155"
            }
        },
        {
            "id": "road_tunnel",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["==", "brunnel", "tunnel"]],
            "paint": {
                "line-color": "#1e293b",
                "line-width": 1,
                "line-dasharray": [2, 2]
            }
        },
        {
            "id": "road_minor",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["!in", "class", "motorway", "trunk", "primary", "secondary"]],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#334155",
                "line-width": 0.5,
                "line-opacity": 0.5
            }
        },
        {
            "id": "road_major",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["in", "class", "motorway", "trunk", "primary", "secondary"]],
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#475569",
                "line-width": 1.5
            }
        },
        {
            "id": "road_major_glow",
            "type": "line",
            "source": "openmaptiles",
            "source-layer": "transportation",
            "filter": ["all", ["in", "class", "motorway", "trunk"]], // Only highways glow
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "rgba(59, 130, 246, 0.2)",
                "line-width": 4,
                "line-blur": 2
            }
        },
        {
            "id": "place_label",
            "type": "symbol",
            "source": "openmaptiles",
            "source-layer": "place",
            "filter": ["all", ["in", "class", "city", "town"]],
            "layout": {
                "text-field": "{name:latin}\n{name:nonlatin}",
                "text-font": ["Noto Sans Regular"], // Assuming default glyphs
                "text-size": 12,
                "text-transform": "uppercase"
            },
            "paint": {
                "text-color": "#94a3b8",
                "text-halo-color": "#0f172a",
                "text-halo-width": 1
            }
        }
    ]
};
