using APIGesCom.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteService _clienteService;
    public ClienteController(IClienteService clienteService) => _clienteService = clienteService;

    [HttpGet]
    public IActionResult Listar() => Ok(_clienteService.ListarTodos());

    [HttpPost]
    public async Task<ActionResult> Insertar([FromBody] Cliente cliente) => this.ResponderOperacion(await _clienteService.InsertarAsync(cliente), creado: true);

    [HttpPut("Modificar")]
    public async Task<ActionResult> ModificarCliente([FromBody] Cliente cliente)
    {
        if (cliente.Id <= 0) return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Datos de cliente inválidos."));
        return this.ResponderOperacion(await _clienteService.ModificarAsync(cliente));
    }

    [HttpPut("Eliminar/{id}")]
    public async Task<ActionResult> EliminarCliente(long id)
    {
        if (id <= 0) return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID del cliente no es válido."));
        return this.ResponderOperacion(await _clienteService.EliminarAsync(id));
    }
}
