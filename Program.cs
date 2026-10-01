using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    // options.AddDefaultPolicy(policy =>
    options.AddPolicy("WeatherWindow", policy => 
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://theweatherwindow.netlify.app"
            ) // Added form BG
             .AllowAnyHeader()
             .AllowAnyMethod();
    });
});

var app = builder.Build();

// app.UseCors();
app.UseCors("WeatherWindow"); // added by BG

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/weather/{city}", async (
    string city,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration ) =>
{
    var apiKey= configuration["OpenWeatherAPIKey"];
    var client = httpClientFactory.CreateClient();

    var response = await client.GetAsync(
        $"https://api.openweathermap.org/geo/1.0/direct?q={Uri.EscapeDataString(city)}&limit=1&appid={apiKey}"
    );

    var data = await response.Content.ReadAsStringAsync();

    return Results.Content(data, "application/json");
});

app.MapGet("/forecast/{lat}/{lon}", async (
    double lat,
    double lon,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration ) =>
{
    var apiKey = configuration["OpenWeatherAPIKey"];
    var client = httpClientFactory.CreateClient();

    var response = await client.GetAsync(
        $"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}&units=metric"
    );

    var data = await response.Content.ReadAsStringAsync();

    return Results.Content(data, "Application/json"); 
});

// GeoJSON Stuff
app.MapGet("/weather/current/{lat}/{lon}", async (
    double lat,
    double lon,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration ) =>
{
    var apiKey = configuration["OpenWeatherAPIKey"];
    var client = httpClientFactory.CreateClient();

    var response = await client.GetAsync(
        $"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric"
    );

    if (!response.IsSuccessStatusCode)
    {
        return Results.StatusCode((int)response.StatusCode);
    }

    var data = await response.Content.ReadAsStringAsync();
    return Results.Content(data, "application/json"); 
});

app.MapGet("/uvi/{lat}/{lon}", async (
    double lat,
    double lon,
    IHttpClientFactory httpClientFactory ) =>
{
    var client = httpClientFactory.CreateClient();
    var response = await client.GetAsync(
        $"https://currentuvindex.com/api/v1/uvi?latitude={lat}&longitude={lon}"
    );

    var data = await response.Content.ReadAsStringAsync();
    return Results.Content(data, "application/json");
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
