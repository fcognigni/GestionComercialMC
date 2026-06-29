using APIGesCom.Models;
using GC_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services
{
    public class ObraService : IObraService
    {
        private readonly IConfiguration _config;

        public ObraService(IConfiguration config)
        {
            _config = config;
        }

        public IEnumerable<ObraDTO> ListarTodos()
        {
            List<ObraDTO> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarObra", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();

            using SqlDataReader reader =
                cmd.ExecuteReader();

            while (reader.Read())
            {
                lista.Add(new ObraDTO
                {
                    Id = Convert.ToInt64(reader["Id"]),
                    Descripcion = reader["Descripcion"].ToString(),
                    IdCliente = Convert.ToInt64(reader["IdCliente"]),
                    FechaAlta = reader["Fecha"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["Fecha"]),
                    MontoPactado = Convert.ToSingle(reader["Monto"]),
                    IdSolicitante =
                        reader["IdSolicitante"] == DBNull.Value
                                ? null
                                : Convert.ToInt64(
                        reader["IdSolicitante"]
                    ),
                    EstadoComercial = reader["EstadoComercial"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString() 
                });
            }

            return lista;
        }

        public long Insertar(Obra obra, int id)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spInsertarObra", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Descripcion", obra.Descripcion);
            cmd.Parameters.AddWithValue("@IdCliente", obra.IdCliente);
            cmd.Parameters.AddWithValue("@MontoPactado",
                obra.MontoPactado);
            cmd.Parameters.AddWithValue("@IdSolicitante",
                (object?)obra.IdSolicitante ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IdEstadoComercial",
                id);

            conn.Open();

            using SqlDataReader dr =
            cmd.ExecuteReader();

            if (dr.Read())
            {
                return Convert.ToInt64(
                    dr["IdObra"]
                );
            }

            return 0;
        }

        public bool Modificar(Obra obra)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spModificarObra", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id", obra.Id);
            cmd.Parameters.AddWithValue("@Descripcion",
                obra.Descripcion);
            cmd.Parameters.AddWithValue("@IdCliente",
                obra.IdCliente);
            cmd.Parameters.AddWithValue("@FechaAlta",
                (object?)obra.FechaAlta ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MontoPactado",
                obra.MontoPactado);
            cmd.Parameters.AddWithValue("@IdSolicitante",
                obra.IdSolicitante);

            conn.Open();

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Eliminar(long id)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spEliminarObra", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id", id);

            conn.Open();

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
