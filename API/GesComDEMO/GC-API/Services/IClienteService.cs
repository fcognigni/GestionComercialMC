
using APIGesCom.Models;
using Microsoft.AspNetCore.Mvc;


namespace APIGesCom.Services

{
    public interface IClienteService
    {
        public List<Cliente> ListarTodos();
        public long Insertar(Cliente cliente);
        Task<ActionResult> ModificarCliente(Cliente cliente);
        Task<ActionResult> EliminarCliente(long id);
    }
}
