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
        public ActionResult<IEnumerable<OrdenDeCompra>>
            ListarTodos()
        {
            return Ok(_service.ListarTodos());
        }

        [HttpGet("{id}")]
        public ActionResult<OrdenDeCompra> ListarPorId(long id)
        {
            return Ok(_service.ListarPorId(id));
        }

        [HttpPost]
        public ActionResult Insertar(
            [FromBody] OrdenDeCompra orden)
        {
            bool resultado =
                _service.Insertar(orden);

            if (!resultado)
                return BadRequest();

            return Ok();
        }

        [HttpPut]
        public ActionResult Modificar(
            [FromBody] OrdenDeCompra orden)
        {
            bool resultado =
                _service.Modificar(orden);

            if (!resultado)
                return BadRequest();

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Eliminar(long id)
        {
            bool resultado =
                _service.Eliminar(id);

            if (!resultado)
                return BadRequest();

            return Ok();
        }
    }
}