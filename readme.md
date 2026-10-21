# 🛡️ weather-window // BACKEND SECURE CORE
> **Status:** `SECURE` | **Node Type:** `REVERSE_PROXY_GATEWAY`

![.NET](https://img.shields.io/badge/Runtime-.NET_8.0-512BD4?style=flat&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/Language-C%23-239120?style=flat&logo=csharp&logoColor=white)
![Security](https://img.shields.io/badge/Architecture-API_Key_Proxy-00599C?style=flat)

The cryptographic firewall and data aggregation node for the Weather Window network. Built using C# and the enterprise .NET runtime to establish a zero-trust architecture that completely shields downstream vendor API keys from public client exposure.

---

## 🔒 SECURITY ARCHITECTURE (THE "PROXY-GUARD" PROTOCOL)
To maintain strict compliance and prevent key compromise or industrial rate-throttling, the client application never interacts directly with external weather providers.
- **The Decryption Loop:** Client UI Requests → .NET API Gateway Route → Secure Server-Side Injection of Keys → External Vendor Intercept → Sanitized Payload Return.
- **Payload Minimization:** The C# server trims unnecessary vendor metadata before delivering the JSON stream, reducing frontend parsing overhead and shrinking network payloads.

---

## 📑 OPERATIONAL ENDPOINTS

### `GET /api/weather/telemetry?city={name}`
Intercepts live weather metrics, computes geospatial coordinate offsets, and calculates immediate weather alerts.
- **Access Level:** Public / Encrypted Handshake
- **Calculated Logic:** Runs internal collection sorting to identify maximum and minimum temperature parameters over the upcoming 120-hour timeline array.

### `GET /api/weather/alerts`
Queries international meteorological threat matrices to determine if severe warning conditions are active for the requested sector. Triggers the frontend countdown sequencer if critical flags are tripped.

---

## 🛠️ TECH SPECS & MIDDLEWARE
- **Runtime Environment:** .NET Core / ASP.NET Web API
- **Language Standard:** C# 12 / 13
- **Data Hydration:** `HttpClientFactory` utilizing native connection-pooling to maximize performance and mitigate socket exhaustion under high concurrent loads.
- **Serialization:** `System.Text.Json` high-performance text handling.

## 🚀 BACKEND LOCAL INITIALIZATION
To deploy this secure calculation container within your local sandbox environment:

1. **Restore Core Dependencies:**
   ```bash
   dotnet restore
