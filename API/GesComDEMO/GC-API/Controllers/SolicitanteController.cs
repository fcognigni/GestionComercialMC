using APIGesCom.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SolicitanteController : ControllerBase
{
    private readonly ISolicitanteService _service;
    public SolicitanteController(ISolicitanteService service) => _service = service;

    [HttpGet] public IActionResult ListarTodos() => Ok(_service.ListarTodos());
    [HttpGet("{id}")] public IActionResult GetById(long id) => _service.ListarPorId(id) is { } solicitante ? Ok(solicitante) : NotFound(ResultadoOperacion.Fallo("NO_ENCONTRADO", "Solicitante inexistente."));
    [HttpPost] public async Task<ActionResult> Insertar([FromBody] Solicitante solicitante) => this.ResponderOperacion(await _service.InsertarAsync(solicitante), creado: true);

    [HttpPut("Modificar")]
    public async Task<ActionResult> Modificar([FromBody] Solicitante solicitante)
    {
        if (solicitante.Id <= 0) return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Datos de solicitante inválidos."));
        return this.ResponderOperacion(await _service.ModificarAsync(solicitante));
    }

    [HttpPut("Eliminar/{id}")]
    public async Task<ActionResult> Eliminar(long id)
    {
        if (id <= 0) return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID del solicitante no es válido."));
        return this.ResponderOperacion(await _service.EliminarAsync(id));
    }
}
