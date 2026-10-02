import { useState, useMemo } from "react";
import * as d3 from "d3";
import type { GeoGeometryObjects, ExtendedFeatureCollection, ExtendedFeature } from "d3-geo";
import { ukCountyCities } from "../utils/cityCountyData"; 
import { useCountyUKWeather } from "../utils/weatherApi"; 
import ukGeoJsonRaw from "../utils/uk-counties.json"; 

interface GeoJsonProperties { 
  county?: string;
  name?: string;
  [key: string]: unknown;
}

type UKFeature = ExtendedFeature<GeoGeometryObjects, GeoJsonProperties>;
const rawData = (ukGeoJsonRaw as { default?: unknown }).default || ukGeoJsonRaw;
const ukGeoJson = rawData as ExtendedFeatureCollection<UKFeature>;

interface CityWeatherInfo {
  cityName: string;
  temp: number | string;
  icon?: string;
  description: string;
};

interface TooltipData {
  county: string;
  cities: CityWeatherInfo[];
  x: number;
  y: number;
};

interface WeatherResultData {
  county: string;
  cityName: string;
  coordinates: [number, number];
  temp: number | string;
  description: string;
  icon?: string;
};

interface ClassNameProps {
  className?: string;
};

function WeatherMap({ className }: ClassNameProps) {
  const width = 800;
  const height = 1200;
  
  const [hoveredData, setHoveredData] = useState<TooltipData | null>(null);

  const queryResults = useCountyUKWeather(ukCountyCities);
  
  const { projection, pathGenerator } = useMemo(() => {
    const proj = d3.geoMercator(); 
    try {
      proj.fitSize([width, height], ukGeoJson); 
    } catch (e) {
      console.error("Projection fit error:", e);
    }
    const path = d3.geoPath().projection(proj); 
    return { projection: proj, pathGenerator: path }; 
  }, [width, height]); 

  const isLoading = queryResults.some(q => q.isLoading);
  const isError = queryResults.some(q => q.isError);

  const readyWeatherData = useMemo(() => {
    return queryResults
      .map(q => q.data as WeatherResultData)
      .filter((data): data is WeatherResultData => !!data); 
  }, [queryResults]);

  const weatherMapByCounty = useMemo(() => {
    const map = new Map<string, WeatherResultData[]>(); 
    readyWeatherData.forEach(item => {
      const key = item.county.toLowerCase(); 
      if (!map.has(key)) {
        map.set(key, []); 
      }
      map.get(key)!.push(item); 
    });
    return map;
  }, [readyWeatherData]);

  if (isLoading) return <div style={{ padding: "20px", color: "#06b6d4", fontFamily: "monospace", background: "#030712" }}>[MISSION INTEL] SYNCHRONIZING REGIONAL METEOROLOGICAL GRID...</div>;
  if (isError) return <div style={{ padding: "20px", color: "#ef4444", fontFamily: "monospace", background: "#030712" }}>[SYSTEM ERROR] TELEMETRY LINK OFFLINE.</div>;

  return (
    <div className={className} style={{ position: "relative", width: "100%", maxWidth: `${width}px`, margin: "0 auto", fontFamily: "monospace" }}>
      
      <div className="text-[10px] sm:text-[12px]" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#06b6d4", letterSpacing: "2px" }}>
        <span>// SECURE SECTOR: UK-MET-GRID</span>
        <span>STATUS: COUNTY_CITY</span>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`}
        width="100%" 
        style={{ 
          background: "#030712", 
          borderRadius: "15px", 
          display: "block", 
          border: "1px solid #0e7490", 
          boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)" 
        }}
      >
        <path 
          d={pathGenerator({ type: "Sphere" } as unknown as GeoGeometryObjects) || ""} 
          fill="#030712"
        />
        
        <g className="map-boundaries">
          {ukGeoJson.features.map((feature: UKFeature, index: number) => {
            const props = feature.properties || {};
            
            const rawCountyName = 
              props.county || 
              props.name || 
              props.NAME || 
              props.LAD24NM || 
              Object.values(props).find(val => typeof val === "string") || 
              ""; 
              
            const countyName = String(rawCountyName);
            const matchedCities = weatherMapByCounty.get(countyName.toLowerCase());

            return (
              <path
                key={index}
                d={pathGenerator(feature) || undefined} 
                fill={hoveredData?.county.toLowerCase() === countyName.toLowerCase() ? "#1e3a8a" : "#0f172a"}       
                stroke={hoveredData?.county.toLowerCase() === countyName.toLowerCase() ? "#06b6d4" : "#164e63"}    
                strokeWidth={hoveredData?.county.toLowerCase() === countyName.toLowerCase() ? 1.5 : 0.8}
                style={{ transition: "fill 0.15s ease, stroke 0.15s ease", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  // d3.select(e.currentTarget).attr("fill", "#1e3a8a").attr("stroke", "#06b6d4").attr("stroke-width", "1.5");
                  
                  if (matchedCities && matchedCities.length > 0) {
                    const [lon, lat] = matchedCities[0].coordinates;
                    const projected = projection([lon, lat]);
                    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (projected && rect) {
                      setHoveredData({
                        county: matchedCities[0].county,
                        cities: matchedCities.map(c => ({
                          cityName: c.cityName,
                          temp: c.temp,
                          icon: c.icon,
                          description: c.description
                        })),
                        x: projected[0] * (rect.width / width),
                        y: projected[1] * (rect.height / height)
                      });
                    }
                  }
                }}
                onMouseLeave={() => { // removed e from parameter
                  // d3.select(e.currentTarget).attr("fill", "#0f172a").attr("stroke", "#164e63").attr("stroke-width", "0.8");
                  setHoveredData(null);
                }}
                onClick={(e) => {
                  if (matchedCities && matchedCities.length > 0) {
                    if (hoveredData && hoveredData.county === matchedCities[0].county) {
                      setHoveredData(null);
                      return;
                    }
                    const [lon, lat] = matchedCities[0].coordinates;
                    const projected = projection([lon, lat]);
                    const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (projected && rect) {
                      setHoveredData({
                        county: matchedCities[0].county,
                        cities: matchedCities.map(c => ({
                          cityName: c.cityName,
                          temp: c.temp,
                          icon: c.icon,
                          description: c.description
                        })),
                        x: projected[0] * (rect.width / width),
                        y: projected[1] * (rect.height / height)
                      });
                    }
                  }
                }}
              />
            );
          })}
        </g>
        
        <g className="weather-pins" style={{ pointerEvents: "none" }}>
          {readyWeatherData.map((city, idx) => {
            const [lon, lat] = city.coordinates;
            const projectedCoords = projection([lon, lat]);

            if (!projectedCoords) return null;
            const [x, y] = projectedCoords;

            if (isNaN(x) || isNaN(y) || (x === 0 && y === 0)) return null;

            return (
              <g key={`${city.county}-${idx}`}>
                <circle cx={x} cy={y} r={4} fill="#06b6d4" opacity={0.6}>
                  <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r={4} fill="#38bdf8" stroke="#ffffff" strokeWidth={1} />
              </g>
            );
          })}
        </g>
      </svg>

      {hoveredData && (
        <div style={{
          position: "absolute",
          top: `${hoveredData.y - 110}px`, 
          left: `${hoveredData.x}px`,
          transform: "translateX(-50%)",
          backgroundColor: "rgba(3, 7, 18, 0.95)",
          color: "#f3f4f6",
          padding: "10px 16px",
          borderRadius: "4px",
          fontSize: "12px",
          pointerEvents: "none", 
          zIndex: 10,
          boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
          border: "1px solid #06b6d4",
          textAlign: "center",
          backdropFilter: "blur(4px)",
          minWidth: "150px"
        }}>
          <div style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
            {hoveredData.county}
          </div>

          {hoveredData.cities.map((city, idx) => (
            <div key={idx} style={{ borderTop: idx > 0 ? "1px dashed #1e293b" : "none", marginTop: idx > 0 ? "6px" : "0", paddingTop: idx > 0 ? "6px" : "0" }}>
              <div style={{ color: "#06b6d4", fontWeight: "bold", letterSpacing: "1px" }}>{city.cityName.toUpperCase()}</div>
              
              {city.icon && city.icon !== "undefined" && (
                <img 
                  src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} 
                  alt="Weather icon"
                  style={{ width: "30px", height: "30px", display: "block", margin: "0 auto", filter: "drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))" }}
                  crossOrigin="anonymous"
                />
              )}
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#facc15" }}>{city.temp}°C</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherMap;


// import { useState, useMemo } from "react";
// import * as d3 from "d3";
// import type { GeoGeometryObjects, ExtendedFeatureCollection, ExtendedFeature } from "d3-geo";
// import { ukCountyCities } from "../utils/cityCountyData"; 
// // import { ukCountyCities } from "../utils/cityCountyData"; 
// import { useCountyUKWeather } from "../utils/weatherApi"; 
// import ukGeoJsonRaw from "../utils/uk-counties.json"; 

// interface GeoJsonProperties { // properties of map boundary
//   county?: string;
//   name?: string;
//   [key: string]: unknown;
// }
// // ExtendedFeature - for D3 path generator // GeoGeometryObjects - type allows for polygons, multipolygon or any D3 valid geometrical shape
// type UKFeature = ExtendedFeature<GeoGeometryObjects, GeoJsonProperties>;
// // Default is the vite wrapper for objects
// const rawData = (ukGeoJsonRaw as { default?: unknown }).default || ukGeoJsonRaw;
// // ExtendedFeatureCollection - D3 type to describe any map collection on Earth
// const ukGeoJson = rawData as ExtendedFeatureCollection<UKFeature>;

// interface CityWeatherInfo {
//   cityName: string;
//   temp: number | string;
//   icon?: string;
//   description: string;
// }

// interface TooltipData {
//   county: string;
//   cities: CityWeatherInfo[];
//   x: number;
//   y: number;
// }

// interface WeatherResultData {
//   county: string;
//   cityName: string;
//   coordinates: [number, number];
//   temp: number | string;
//   description: string;
//   icon?: string;
// }

// interface ClassNameProps {
//   className?: string;
// }

// function WeatherMap({ className }: ClassNameProps) {
//   const width = 800;
//   const height = 1200;
  
//   const [hoveredData, setHoveredData] = useState<TooltipData | null>(null);
//   // Added for mobile
//   const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

//   const queryResults = useCountyUKWeather(ukCountyCities);
  
//   // 1. ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURNS
//   const { projection, pathGenerator } = useMemo(() => {
//     const proj = d3.geoMercator(); // Mahs formula for converting 3D spherical / 2D spherical surface data to flat 2D  
//     try {
//       proj.fitSize([width, height], ukGeoJson); // fitSize scales and centres map
//     } catch (e) {
//       console.error("Projection fit error:", e);
//     }
//     const path = d3.geoPath().projection(proj); // path generator trasnlates coordinates into SVG coordinates / path commands
//     return { projection: proj, pathGenerator: path }; // projection converts lat lon to x, y positions for dots and tooltips
//   }, [width, height]); // path Generator draws shape of counties

//   const isLoading = queryResults.some(q => q.isLoading);
//   const isError = queryResults.some(q => q.isError);

//   const readyWeatherData = useMemo(() => {
//     return queryResults
//       .map(q => q.data as WeatherResultData)
//       .filter((data): data is WeatherResultData => !!data); // converts values ot strict truthy or falsy to weed out undefined or null values
//   }, [queryResults]);

//   const weatherMapByCounty = useMemo(() => {
//     const map = new Map<string, WeatherResultData[]>(); // <key, value>
//     readyWeatherData.forEach(item => {
//       const key = item.county.toLowerCase(); // Grab county name match up with toLowerCase()
//       if (!map.has(key)) {
//         map.set(key, []); // if map doesn't have the county create a new array for it
//       }
//       map.get(key)!.push(item); // pushes current weather into county array
//     });
//     return map;
//   }, [readyWeatherData]);

//   // 2. CONDITIONAL RETURNS HAPPEN AFTER ALL HOOKS ARE CALLED
//   if (isLoading) return <div style={{ padding: "20px", color: "#06b6d4", fontFamily: "monospace", background: "#030712" }}>[MISSION INTEL] SYNCHRONIZING REGIONAL METEOROLOGICAL GRID...</div>;
//   if (isError) return <div style={{ padding: "20px", color: "#ef4444", fontFamily: "monospace", background: "#030712" }}>[SYSTEM ERROR] TELEMETRY LINK OFFLINE.</div>;

//   return (
//     <div className={className} style={{ position: "relative", width: "100%", maxWidth: `${width}px`, margin: "0 auto", fontFamily: "monospace" }}>
      
//       <div className="text-[10px] sm:text-[12px]" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#06b6d4", letterSpacing: "2px" }}>
//         <span>// SECURE SECTOR: UK-MET-GRID</span>
//         <span>STATUS: ACTIVE_FEED</span>
//       </div>

//       <svg 
//         viewBox={`0 0 ${width} ${height}`}
//         width="100%" 
//         // height={height} 
//         style={{ 
//           background: "#030712", 
//           borderRadius: "15px", 
//           display: "block", 
//           border: "1px solid #0e7490", 
//           boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)" 
//         }}
//       >
//         <path 
//           d={pathGenerator({ type: "Sphere" } as unknown as GeoGeometryObjects) || ""} 
//           fill="#030712"
//         />
        
//         <g className="map-boundaries">

//           {ukGeoJson.features.map((feature: UKFeature, index: number) => {
//             const props = feature.properties || {};
            
//             // Clean property lookup — Fermanagh and Grampian will be caught naturally
//             const rawCountyName = // evaluate sequentially untl a truthy value is returned
//               props.county || 
//               props.name || 
//               props.NAME || 
//               props.LAD24NM || 
//               Object.values(props).find(val => typeof val === "string") || 
//               ""; // scans property object values to find he first available string
              
//             const countyName = String(rawCountyName);
//             // ADded for mobile
//             const countyKey = countyName.toLowerCase();
//             // And another
//             const isSelected = selectedCounty === countyKey;

//             const matchedCities = weatherMapByCounty.get(countyName.toLowerCase());

//             return (
//               <path
//                 key={index}
//                 d={pathGenerator(feature) || undefined} // coverts multi point polygon featres to SVG commands d=".."
//                 fill="#0f172a"       
//                 stroke="#164e63"    
//                 strokeWidth={0.8}
//                 //  fill={isSelected ? "#1e3a8a" : "#0f172a"}       
//                 // stroke={isSelected ? "#06b6d4" : "#164e63"}    
//                 // strokeWidth={isSelected ? 1.5 : 0.8}
//                 style={{ transition: "fill 0.15s ease, stroke 0.15s ease", cursor: "pointer" }}
//                 onMouseEnter={(e) => {
//                   d3.select(e.currentTarget).attr("fill", "#1e3a8a").attr("stroke", "#06b6d4").attr("stroke-width", "1.5");
                  
//                   if (matchedCities && matchedCities.length > 0) {
//                     const [lon, lat] = matchedCities[0].coordinates;
//                     const projected = projection([lon, lat]);
//                     if (projected) {
//                       setHoveredData({
//                         county: matchedCities[0].county,
//                         cities: matchedCities.map(c => ({
//                           cityName: c.cityName,
//                           temp: c.temp,
//                           icon: c.icon,
//                           description: c.description
//                         })),
//                         x: projected[0],
//                         y: projected[1]
//                       });
//                     }
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   d3.select(e.currentTarget).attr("fill", "#0f172a").attr("stroke", "#164e63").attr("stroke-width", "0.8");
//                   setHoveredData(null);
//                 }}
//                 onClick={() => {
//                   // If clicking the already selected county, close it
//                   if (isSelected) {
//                     setSelectedCounty(null);
//                     setHoveredData(null);
//                   } else {
//                     // Update state to the newly selected county
//                     setSelectedCounty(countyKey);
                    
//                     if (matchedCities && matchedCities.length > 0) {
//                       const [lon, lat] = matchedCities[0].coordinates;
//                       const projected = projection([lon, lat]);
//                       if (projected) {
//                         setHoveredData({
//                           county: matchedCities[0].county,
//                           cities: matchedCities.map(c => ({
//                             cityName: c.cityName,
//                             temp: c.temp,
//                             icon: c.icon,
//                             description: c.description
//                           })),
//                           x: projected[0],
//                           y: projected[1]
//                         });
//                       }
//                     } else {
//                       // If a county has no weather data, clear the tooltip overlay
//                       setHoveredData(null);
//                     }
//                   }
//                 }}
//               />
//             );
//           })}
//         </g>
        
//         <g className="weather-pins" style={{ pointerEvents: "none" }}>
//           {readyWeatherData.map((city, idx) => {
//             const [lon, lat] = city.coordinates;
//             const projectedCoords = projection([lon, lat]);

//             if (!projectedCoords) return null;
//             const [x, y] = projectedCoords;

//             if (isNaN(x) || isNaN(y) || (x === 0 && y === 0)) return null;

//             return (
//               <g key={`${city.county}-${idx}`}>
//                 <circle // outer pulsig circle
//                   cx={x}
//                   cy={y}
//                   r={4}
//                   fill="#06b6d4"
//                   opacity={0.6}
//                 >
//                   <animate attributeName="r" values="4;12;4" dur="2.5s" repeatCount="indefinite" />
//                   <animate attributeName="opacity" values="0.9;0;0.9" dur="2.5s" repeatCount="indefinite" />
//                 </circle>
//                 <circle // inner core circle
//                   cx={x}
//                   cy={y}
//                   r={4}
//                   fill="#38bdf8"
//                   stroke="#ffffff"
//                   strokeWidth={1}
//                 />
//               </g>
//             );
//           })}
//         </g>
//       </svg>

//       {hoveredData && (
//         <div style={{
//           position: "absolute",
//           top: `${hoveredData.y - 100}px`, 
//           left: `${hoveredData.x}px`,
//           transform: "translateX(-50%)",
//           backgroundColor: "rgba(3, 7, 18, 0.95)",
//           color: "#f3f4f6",
//           padding: "10px 16px",
//           borderRadius: "4px",
//           fontSize: "12px",
//           pointerEvents: "none", 
//           zIndex: 10,
//           boxShadow: "0 0 20px rgba(6, 182, 212, 0.35)",
//           border: "1px solid #06b6d4",
//           textAlign: "center",
//           backdropFilter: "blur(4px)",
//           minWidth: "150px"
//         }}>
//           <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>
//             SECTOR: {hoveredData.county}
//           </div>

//           {hoveredData.cities.map((city, idx) => (
//             <div key={idx} style={{ borderTop: idx > 0 ? "1px dashed #1e293b" : "none", marginTop: idx > 0 ? "6px" : "0", paddingTop: idx > 0 ? "6px" : "0" }}>
//               <div style={{ color: "#06b6d4", fontWeight: "bold", letterSpacing: "1px" }}>{city.cityName.toUpperCase()}</div>
              
//               {city.icon && city.icon !== "undefined" && (
//                 <img 
//                   src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} 
//                   alt="Weather icon"
//                   style={{ width: "30px", height: "30px", display: "block", margin: "0 auto", filter: "drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))" }}
//                   crossOrigin="anonymous"
//                 />
//               )}
//               <div style={{ fontSize: "14px", fontWeight: "bold", color: "#facc15" }}>{city.temp}°C</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default WeatherMap;