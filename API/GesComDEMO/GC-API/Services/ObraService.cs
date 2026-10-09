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

        public IEnumerable<ObraDTO> ListarTodos(ObraFiltro filtro)
        {
            List<ObraDTO> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarObras", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
            "@FechaDesde",
            (object?)filtro.FechaDesde
            ?? DBNull.Value
        );

            cmd.Parameters.AddWithValue(
                "@FechaHasta",
                (object?)filtro.FechaHasta
                ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@IdCliente",
                (object?)filtro.idCliente
                ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@Page",
                filtro.Page
            );

            cmd.Parameters.AddWithValue(
                "@PageSize",
                filtro.PageSize
            );

            conn.Open();

            using SqlDataReader reader =
                cmd.ExecuteReader();

            while (reader.Read())
            {
                lista.Add(new ObraDTO
                {
                    Id = Convert.ToInt64(reader["Id"]),
                    Referencia = reader["Referencia"].ToString(),
                    IdCliente = Convert.ToInt64(reader["IdCliente"]),
                    FechaAlta = reader["Fecha"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["Fecha"]),
                    Moneda = reader["Moneda"].ToString(),
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

            cmd.Parameters.AddWithValue("@Referencia", obra.Referencia);
            cmd.Parameters.AddWithValue("@IdCliente", obra.IdCliente);
            cmd.Parameters.AddWithValue("@IdMoneda", obra.IdMoneda);
            cmd.Parameters.AddWithValue("@MontoPactado",
                obra.MontoPactado);
            cmd.Parameters.AddWithValue("@IdSolicitante",
                (object?)obra.IdSolicitante ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IdEstadoComercial",
                id);

            conn.Open();

            object result = cmd.ExecuteScalar();

            if (result != null && result != DBNull.Value)
            {
                return Convert.ToInt64(result);
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
            cmd.Parameters.AddWithValue("@Referencia",
                obra.Referencia);
            cmd.Parameters.AddWithValue("@IdCliente",
                obra.IdCliente);
            cmd.Parameters.AddWithValue("@FechaAlta",
                (object?)obra.FechaAlta ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IdMoneda",
                obra.IdMoneda);
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
