using APIGesCom.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenDeCompraController : ControllerBase
    {
        private readonly IOrdenDeCompraService _service;

        public OrdenDeCompraController(
            IOrdenDeCompraService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrdenDeCompra>>>
            ListarTodos()
        {
            return Ok(await _service.ListarTodos());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrdenDeCompra>> ListarPorId(long id)
        {
            var orden = await _service.ListarPorId(id);
            return orden == null
                ? NotFound(ResultadoOperacion.Fallo("NO_ENCONTRADO", "Orden de compra inexistente."))
                : Ok(orden);
        }

        [HttpPost]
        public async Task<ActionResult> Insertar(
            [FromBody] OrdenDeCompra orden)
        {
            return this.ResponderOperacion(
                await _service.InsertarAsync(orden),
                creado: true);
        }

        [HttpPut]
        public async Task<ActionResult> Modificar(
            [FromBody] OrdenDeCompra orden)
        {
            if (orden.Id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "Datos de orden de compra inválidos."));

            return this.ResponderOperacion(await _service.ModificarAsync(orden));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Eliminar(long id)
        {
            if (id <= 0)
                return BadRequest(ResultadoOperacion.Fallo("VALIDACION", "El ID de la orden de compra no es válido."));

            return this.ResponderOperacion(await _service.EliminarAsync(id));
        }
    }
}
