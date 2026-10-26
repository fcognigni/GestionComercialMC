using GC_API.Models;

namespace APIGesCom.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}