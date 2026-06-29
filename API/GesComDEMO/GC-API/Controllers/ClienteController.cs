using APIGesCom.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIGesCom.Models;

namespace APIGesCom.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly IClienteService _clienteService;

        public ClienteController(IClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var lista = _clienteService.ListarTodos();

            return Ok(lista);
        }

        [HttpPost]
        public IActionResult Insertar([FromBody] Cliente cliente)
        {
            var response = _clienteService.Insertar(cliente);

            return Ok(response);
        }

        [HttpPut("Modificar")]
        public async Task<ActionResult> ModificarCliente([FromBody] Cliente cliente)
        {
            if (cliente == null || cliente.Id <= 0)
            {
                return BadRequest("Datos de cliente inválidos.");
            }

            var response = await _clienteService.ModificarCliente(cliente);

            return Ok(response);
        }


        [HttpPut("Eliminar/{id}")]
        public async Task<ActionResult> EliminarCliente(long id)
        {
            if (id <= 0)
            {
                return BadRequest("El Id del cliente no es válido.");
            }

            var response = await _clienteService.EliminarCliente(id);

            return Ok(response);
        }
    }

}
