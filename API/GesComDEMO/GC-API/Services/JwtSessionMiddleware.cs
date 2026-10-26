using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace APIGesCom.Services;

public sealed class JwtSessionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public JwtSessionMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments("/api") ||
            context.Request.Path.StartsWithSegments("/api/auth") ||
            HttpMethods.IsOptions(context.Request.Method))
        {
            await _next(context);
            return;
        }

        var token = context.Request.Headers.Authorization.ToString().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        if (token.Length != 2 || !string.Equals(token[0], "Bearer", StringComparison.OrdinalIgnoreCase) || !TryValidate(token[1], out var principal))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new { mensaje = "La sesión no es válida o expiró." });
            return;
        }

        context.User = principal;
        await _next(context);
    }

    private bool TryValidate(string token, out ClaimsPrincipal principal)
    {
        principal = new ClaimsPrincipal();
        var sections = token.Split('.');
        if (sections.Length != 3) return false;

        try
        {
            var key = _configuration["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(key)) return false;

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
            var expected = hmac.ComputeHash(Encoding.UTF8.GetBytes($"{sections[0]}.{sections[1]}"));
            if (!CryptographicOperations.FixedTimeEquals(expected, DecodeBase64Url(sections[2]))) return false;

            using var document = JsonDocument.Parse(DecodeBase64Url(sections[1]));
            var payload = document.RootElement;
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            if (!payload.TryGetProperty("exp", out var expiration) || expiration.GetInt64() <= now) return false;
            if (payload.GetProperty("iss").GetString() != (_configuration["Jwt:Issuer"] ?? "GesComApi")) return false;
            if (payload.GetProperty("aud").GetString() != (_configuration["Jwt:Audience"] ?? "GesComFrontend")) return false;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, payload.GetProperty("sub").GetString() ?? string.Empty),
                new Claim(ClaimTypes.Role, payload.GetProperty("role").GetString() ?? string.Empty)
            };
            principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "Bearer"));
            return true;
        }
        catch { return false; }
    }

    private static byte[] DecodeBase64Url(string value)
    {
        var normalized = value.Replace('-', '+').Replace('_', '/');
        normalized = normalized.PadRight(normalized.Length + (4 - normalized.Length % 4) % 4, '=');
        return Convert.FromBase64String(normalized);
    }
}