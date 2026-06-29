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
            ActionResult<IEnumerable<ObraEstadoComercial>>>
            ListarTodos()
        {
            return Ok(
                await _service.ListarTodosAsync());
        }

        [HttpGet("{id}")]
        public async Task<
            ActionResult<IEnumerable<ObraEstadoComercialDTO>>>
            ListarPorObra(long id)
        {
            return Ok(
                await _service.ListarPorObraAsync(id));
        }

        [HttpGet("estado/{id}")]
        public async Task<
            ActionResult<IEnumerable<ObraEstadoComercial>>>
            ListarPorEstado(long id)
        {
            return Ok(
                await _service
                    .ListarPorEstadoComercialAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult>
            Insertar(
                [FromBody]
                ObraEstadoComercial estado)
        {
            bool resultado =
                await _service
                    .InsertarAsync(estado);

            if (!resultado)
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