using APIGesCom.Models;
using APIGesCom.Services;
using GC_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObraController : ControllerBase
    {
        private readonly IObraService _service;
        public ObraController(IObraService service) => _service = service;

        [HttpGet]
        public ActionResult<IEnumerable<ObraDTO>> ListarTodos([FromQuery] ObraFiltro filtro) => Ok(_service.ListarTodos(filtro));

        [HttpPost]
        public async Task<ActionResult> Insertar([FromBody] Obra obra)
        {
            if (obra.IdCliente <= 0 || obra.IdEstadoComercial <= 0 || obra.IdMoneda is null or <= 0 || string.IsNullOrWhiteSpace(obra.Referencia) || obra.MontoPactado <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Los datos de la obra son inválidos."));

            return this.ResponderOperacion(await _service.InsertarAsync(obra), creado: true);
        }

        [HttpPut]
        public async Task<ActionResult> Modificar([FromBody] Obra obra)
        {
            if (obra.Id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Datos de obra inválidos."));

            return this.ResponderOperacion(await _service.ModificarAsync(obra));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(long id)
        {
            if (id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID de la obra no es válido."));

            return this.ResponderOperacion(await _service.EliminarAsync(id));
        }
    }
}