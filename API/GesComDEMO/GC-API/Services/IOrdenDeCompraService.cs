using APIGesCom.Models;

namespace APIGesCom.Services
{
    public interface IOrdenDeCompraService
    {
        public Task<IEnumerable<OrdenDeCompra>> ListarTodos();

        public Task<OrdenDeCompra?> ListarPorId(long id);

        Task<ResultadoOperacion> InsertarAsync(OrdenDeCompra orden);

        Task<ResultadoOperacion> ModificarAsync(OrdenDeCompra orden);

        Task<ResultadoOperacion> EliminarAsync(long id);
    }
}
