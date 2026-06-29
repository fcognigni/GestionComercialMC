using APIGesCom.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services
{
    public class EstadoComercialService : IEstadoComercialService
    {

        private readonly IConfiguration _config;

        public EstadoComercialService(IConfiguration config)
        {
            _config = config;
        }

        public List<EstadoComercial> ListarTodos()
        {
            List<EstadoComercial> lista = new List<EstadoComercial>();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarEstadoComercial", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();

            using SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                EstadoComercial EC = new EstadoComercial();

                EC.Id = Convert.ToInt32(reader["Id"]);
                EC.Nombre = reader["Nombre"].ToString();

                lista.Add(EC);
            }

            return lista;
        }
    }
}
