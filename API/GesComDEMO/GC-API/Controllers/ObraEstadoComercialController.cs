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
            int resultado =
                await _service
                    .InsertarAsync(estado);

            if (resultado == 0)
                return BadRequest();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult>
            Eliminar(long id)
        {
            bool resultado =
                await _service
                    .EliminarAsync(id);

            if (!resultado)
                return BadRequest();

            return Ok();
        }
    }
}