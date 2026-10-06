
using APIGesCom.Services;
using GC_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadisticasController : ControllerBase
    {
        private readonly IEstadisticasService _estadisticasService;

        public EstadisticasController(
            IEstadisticasService estadisticasService)
        {
            _estadisticasService = estadisticasService;
        }


        // ============================================================
        // COTIZACIONES
        // GET: api/Estadisticas/cotizaciones
        // ============================================================

        [HttpGet("cotizaciones")]
        public async Task<ActionResult<List<EstadisticaCotizacionDTO>>>
            Cotizaciones()
        {
            var resultado =
                await _estadisticasService
                    .ListarEstadisticasCotizaciones();

            return Ok(resultado);
        }


        // ============================================================
        // OBRAS
        // GET: api/Estadisticas/obras
        // ============================================================

        [HttpGet("obras")]
        public async Task<ActionResult<List<EstadisticaObraDTO>>>
            Obras()
        {
            var resultado =
                await _estadisticasService
                    .ListarEstadisticasObras();

            return Ok(resultado);
        }
    }
}

