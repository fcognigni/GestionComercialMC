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

        [HttpGet("cotizacion /{id}")]
        public ActionResult <Cotizacion> ListarPorId(long Id)
        {
            var cotizacion = _cotizacionService.ListarPorId(Id);

            return Ok(cotizacion);
        }


        [HttpPost]
        public ActionResult Insertar([FromBody] Cotizacion cotizacion)
        {
            var resultado =
                _cotizacionService.Insertar(cotizacion);

            return Ok();
        }

        [HttpPut]
        public ActionResult Modificar([FromBody] Cotizacion cotizacion)
        {
            bool resultado =
                _cotizacionService.Modificar(cotizacion);

            if (!resultado)
                return BadRequest();

            return Ok();
        }
    }
}