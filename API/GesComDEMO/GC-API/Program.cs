using APIGesCom.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddScoped<IObraService, ObraService>();
builder.Services.AddScoped<IObraEstadoComercialService, ObraEstadoComercialService>();
builder.Services.AddScoped<ISolicitanteService, SolicitanteService>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IEstadoComercialService, EstadoComercialService>();
builder.Services.AddScoped<IOrdenDeCompraService, OrdenDeCompraService>();
builder.Services.AddScoped<ICotizacionService, CotizacionService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("PermitirFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
