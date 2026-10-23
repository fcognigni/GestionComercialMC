using APIGesCom.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;
using GC_API.Models;

namespace APIGesCom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObraEstadoComercialController
        : ControllerBase
    {
        private readonly
            IObraEstadoComercialService _service;

        public ObraEstadoComercialController(
            IObraEstadoComercialService service)
        {
            _service = service;
        }


        [HttpGet]
        public async Task<
            ActionResult<
                ResultadoPaginado<ObraEstadoComercialDTO>
            >
        > Listar(
            [FromQuery] ObraEstadoComercialFiltro filtro)
        {
            return Ok(
                await _service.ListarAsync(filtro)
            );
        }

        [HttpPost]
        public async Task<ActionResult>
            Insertar(
                [FromBody]
                ObraEstadoComercial estado)
        {
            return this.ResponderOperacion(
                await _service.InsertarAsync(estado),
                creado: true);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult>
            Eliminar(long id)
        {
            if (id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID del movimiento no es válido."));

            return this.ResponderOperacion(
                await _service.EliminarAsync(id));
        }
    }
}
