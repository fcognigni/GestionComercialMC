namespace GC_API.Models;

public sealed class LoginResponse
{
    public string Token { get; init; } = string.Empty;
    public DateTime ExpiresAtUtc { get; init; }
    public string Usuario { get; init; } = string.Empty;
    public string Permiso { get; init; } = string.Empty;
}