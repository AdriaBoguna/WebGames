using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Configuration;
using TodoApi.Data;
using TodoApi.Data.Repositories;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);


//builder.Services.AddDbContext<PosgreSQLConfig>(opt =>
//    opt.UseSqlServer(builder.Configuration.GetConnectionString("WebApiDatabase")));
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSingleton(builder.Services.AddDbContext<PosgreSQLConfig>(options =>
    options.UseSqlServer("WebApiDatabase")));

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<CityRepository>();
builder.Services.AddScoped<RankingRepository>();
builder.Services.AddScoped<GameRepository>();



builder.Services.AddControllers();

builder.Services.AddMemoryCache();

builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Nueva Politica", app =>
    {
        app.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
//--------------------------------------------

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//CORS
app.UseCors("Nueva Politica");
//------------------------------------------------
app.UseAuthorization();


app.MapControllers();

app.Run();