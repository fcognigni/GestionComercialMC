using APIGesCom.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using APIGesCom.Services;

namespace APIGesCom.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class EstadoComercialController : ControllerBase
    {

        private readonly IEstadoComercialService _estadoComercialService;

        public EstadoComercialController(IEstadoComercialService estadoComercialService)
        {
            _estadoComercialService = estadoComercialService;
        }


        // GET: EstadoComercialController
        [HttpGet]
        public ActionResult<IEnumerable<EstadoComercial>> Listar()
        {
            var lista = _estadoComercialService.ListarTodos();

            return lista;
        }

    }
}
