using APIGesCom.Services;
using GC_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return response is null
            ? Unauthorized(new { mensaje = "Usuario o contraseña incorrectos." })
            : Ok(response);
    }
}