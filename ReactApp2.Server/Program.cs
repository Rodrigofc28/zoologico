/*
*
*   Desenvolvido por Rodrigo de Freitas Camargo
*
*/
using ReactApp2.Server.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configura SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ativa o CORS para permitir todas as origens e métodos
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder
            .AllowAnyOrigin() // Permite qualquer origem
            .AllowAnyHeader() // Permite qualquer cabeçalho
            .AllowAnyMethod(); // Permite qualquer método (GET, POST, PUT, DELETE, etc.)
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplicar a política de CORS antes da autorização
app.UseCors("AllowAllOrigins");

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Aplicando HTTPS Redirection e autorização
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

// Fallback para arquivos estáticos (caso use SPA no frontend)
app.MapFallbackToFile("/index.html");

app.Run();




