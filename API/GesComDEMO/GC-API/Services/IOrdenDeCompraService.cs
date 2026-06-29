using APIGesCom.Models;

namespace APIGesCom.Services
{
    public interface IOrdenDeCompraService
    {
        public Task<IEnumerable<OrdenDeCompra>> ListarTodos();

        public Task<OrdenDeCompra?> ListarPorId(long id);

        bool Insertar(OrdenDeCompra orden);

        bool Modificar(OrdenDeCompra orden);

        bool Eliminar(long id);
    }
}
