using APIGesCom.Models;
using GC_API.Models;
using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObraController : ControllerBase
    {
        private readonly IObraService _service;

        public ObraController(IObraService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ObraDTO>> ListarTodos()
        {
            var obras = _service.ListarTodos();

            return Ok(obras);
        }

        [HttpPost]
        public ActionResult Insertar([FromBody] Obra obra, int id)
        {
            long idObra =
                _service.Insertar(
                    obra,
                    id
            );

            if (idObra == 0)
                return BadRequest();

            return Ok(new
            {
                IdObra = idObra
            });
        }

        [HttpPut]
        public ActionResult Modificar([FromBody] Obra obra)
        {
            bool resultado =
                _service.Modificar(obra);

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