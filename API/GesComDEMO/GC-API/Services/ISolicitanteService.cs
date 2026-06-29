using APIGesCom.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Services
{
    public interface ISolicitanteService
    {
        public List<Solicitante> ListarTodos();
        public Solicitante? ListarPorId(long id);
        public bool Insertar(Solicitante solicitante);
        Task<ActionResult> ModificarSolicitante(Solicitante solicitante);

        Task<ActionResult> EliminarSolicitante(long id);
    }
}
