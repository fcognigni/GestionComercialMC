using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using GC_API.Models;
using Microsoft.Data.SqlClient;

namespace APIGesCom.Services;

public sealed class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;

    public AuthService(IConfiguration configuration) => _configuration = configuration;

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Usuario) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        await using var connection = new SqlConnection(_configuration.GetConnectionString("GesComDemo"));
        await using var command = new SqlCommand("AppData.spLogin", connection)
        {
            CommandType = System.Data.CommandType.StoredProcedure
        };
        command.Parameters.AddWithValue("@Usuario", request.Usuario.Trim());
        command.Parameters.AddWithValue("@Password", request.Password);

        await connection.OpenAsync();
        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync()) return null;

        var usuario = reader["Nombre"].ToString() ?? string.Empty;
        var permiso = reader["Permiso"].ToString() ?? string.Empty;
        return CrearRespuesta(usuario, permiso);
    }

    private LoginResponse CrearRespuesta(string usuario, string permiso)
    {
        var key = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Falta configurar Jwt:Key.");
        var issuer = _configuration["Jwt:Issuer"] ?? "GesComApi";
        var audience = _configuration["Jwt:Audience"] ?? "GesComFrontend";
        var expiresAt = DateTime.UtcNow.AddHours(8);
        var issuedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var expiresAtUnix = new DateTimeOffset(expiresAt).ToUnixTimeSeconds();

        var header = Base64Url(JsonSerializer.Serialize(new { alg = "HS256", typ = "JWT" }));
        var payload = Base64Url(JsonSerializer.Serialize(new
        {
            sub = usuario,
            role = permiso,
            iss = issuer,
            aud = audience,
            iat = issuedAt,
            exp = expiresAtUnix
        }));
        var content = $"{header}.{payload}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
        var signature = Base64Url(hmac.ComputeHash(Encoding.UTF8.GetBytes(content)));

        return new LoginResponse { Token = $"{content}.{signature}", ExpiresAtUtc = expiresAt, Usuario = usuario, Permiso = permiso };
    }

    private static string Base64Url(string value) => Base64Url(Encoding.UTF8.GetBytes(value));
    private static string Base64Url(byte[] value) => Convert.ToBase64String(value).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}