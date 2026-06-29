using APIGesCom.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SolicitanteController : ControllerBase
    {
        private readonly ISolicitanteService _solicitanteService;

        public SolicitanteController(ISolicitanteService solicitanteService)
        {
            _solicitanteService = solicitanteService;
        }

        [HttpGet]
        public IActionResult ListarTodos()
        {
            var lista = _solicitanteService.ListarTodos();

            return Ok(lista);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var solicitante = _solicitanteService.ListarPorId(id);

            if (solicitante == null)
                return NotFound();

            return Ok(solicitante);
        }

        [HttpPost]
        public IActionResult Insertar([FromBody] Solicitante solicitante)
        {
            bool resultado = _solicitanteService.Insertar(solicitante);

            if (!resultado)
                return BadRequest();

            return Ok(new
            {
                mensaje = "Solicitante insertado correctamente"
            });
        }

        [HttpPut("Modificar")]
        public async Task<ActionResult> ModificarCliente([FromBody] Solicitante solicitante)
        {
            if (solicitante == null || solicitante.Id <= 0)
            {
                return BadRequest("Datos de cliente inválidos.");
            }

            var response = await _solicitanteService.ModificarSolicitante(solicitante);

            if(response == null) return BadRequest();

            return Ok(response);
        }


        [HttpPut("Eliminar/{id}")]
        public async Task<ActionResult> EliminarSolicitante(long id)
        {
            if (id <= 0)
            {
                return BadRequest("El Id del cliente no es válido.");
            }

            var response = await _solicitanteService.EliminarSolicitante(id);
            return Ok(response);
        }
    
}
}