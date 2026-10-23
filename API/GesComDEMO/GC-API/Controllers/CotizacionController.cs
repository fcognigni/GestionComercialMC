using APIGesCom.Models;
using APIGesCom.Services;
using GC_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CotizacionController : ControllerBase

    {

        private readonly ICotizacionService _cotizacionService;

        public CotizacionController(ICotizacionService cotizacionService)
        {
            _cotizacionService = cotizacionService;
        }

        [HttpGet]
        public async Task<
            ActionResult<
                ResultadoPaginado<CotizacionDTO>
            >
        > Listar(
            [FromQuery] CotizacionFiltro filtro)
        {
            return Ok(
                await _cotizacionService.ListarAsync(filtro)
            );
        }

        [HttpGet("{id}")]
        public ActionResult <Cotizacion> ListarPorId(long Id)
        {
            var cotizacion = _cotizacionService.ListarPorId(Id);

            return cotizacion == null
                ? NotFound(ResultadoOperacion.Fallo("NO_ENCONTRADO", "Cotización inexistente."))
                : Ok(cotizacion);
        }


        [HttpPost]
        public async Task<ActionResult> Insertar([FromBody] Cotizacion cotizacion)
        {
            return this.ResponderOperacion(
                await _cotizacionService.InsertarAsync(cotizacion),
                creado: true);
        }

        [HttpPut]
        public async Task<ActionResult> Modificar([FromBody] Cotizacion cotizacion)
        {
            if (cotizacion.Id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Datos de cotización inválidos."));

            return this.ResponderOperacion(
                await _cotizacionService.ModificarAsync(cotizacion));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(long id)
        {
            if (id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID de la cotización no es válido."));

            return this.ResponderOperacion(
                await _cotizacionService.EliminarAsync(id));
        }
    }
}
