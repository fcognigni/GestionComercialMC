using APIGesCom.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace APIGesCom.Services
{
    public class OrdenDeCompraService : IOrdenDeCompraService
    {
        private readonly IConfiguration _config;

        public OrdenDeCompraService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<IEnumerable<OrdenDeCompra>> ListarTodos()
        {
            List<OrdenDeCompra> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spListarOrdenDeCompra",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            await conn.OpenAsync();

            using (var reader = await cmd.ExecuteReaderAsync())
            {

                while (await reader.ReadAsync())
                {
                    lista.Add(new OrdenDeCompra
                    {
                        Id = Convert.ToInt64(reader["Id"]),
                        Numero = reader["Numero"].ToString(),

                        IdCliente =
                            Convert.ToInt64(reader["IdCliente"]),

                        IdSolicitante =
                            reader["IdSolicitante"] == DBNull.Value
                            ? null
                            : Convert.ToInt64(reader["IdSolicitante"]),

                        IdObra =
                            reader["IdObra"] == DBNull.Value
                            ? null
                            : Convert.ToInt64(reader["IdObra"]),

                        IdCotizacion =
                            reader["IdCotizacion"] == DBNull.Value
                            ? null
                            : Convert.ToInt64(reader["IdCotizacion"]),

                        Fecha =
                            reader["Fecha"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(reader["Fecha"]),

                        Monto =
                            reader["Monto"] == DBNull.Value
                            ? null
                            : Convert.ToDecimal(reader["Monto"]),

                        IVA =
                            reader["IVA"] == DBNull.Value
                            ? null
                            : Convert.ToDecimal(reader["IVA"])
                    });
                }
            }

            return lista;
        }

        public async Task<OrdenDeCompra?> ListarPorId(long id)
        {
            string connString =
            _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarOrdenDeCompraId", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();

            using (var reader = await cmd.ExecuteReaderAsync())
            {

                if (await reader.ReadAsync())
                {
                    OrdenDeCompra OC = new OrdenDeCompra();

                    OC.Id = Convert.ToInt64(reader["Id"]);
                    OC.Numero = reader["Numero"].ToString();

                    OC.IdCliente =
                        Convert.ToInt64(reader["IdCliente"]);

                    OC.IdSolicitante =
                        reader["IdSolicitante"] == DBNull.Value
                        ? null
                        : Convert.ToInt64(reader["IdSolicitante"]);

                    OC.IdObra =
                        reader["IdObra"] == DBNull.Value
                        ? null
                        : Convert.ToInt64(reader["IdObra"]);

                    OC.IdCotizacion =
                        reader["IdCotizacion"] == DBNull.Value
                        ? null
                        : Convert.ToInt64(reader["IdCotizacion"]);

                    OC.Fecha =
                        reader["Fecha"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["Fecha"]);

                    OC.Monto =
                        reader["Monto"] == DBNull.Value
                        ? null
                        : Convert.ToDecimal(reader["Monto"]);

                    OC.IVA =
                        reader["IVA"] == DBNull.Value
                        ? null
                        : Convert.ToDecimal(reader["IVA"]);

                    return OC;
                }
            }
            return null;
        }
        

        public bool Insertar(OrdenDeCompra orden)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spInsertarOrdenDeCompra",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Numero",
                orden.Numero);

            cmd.Parameters.AddWithValue(
                "@IdCliente",
                orden.IdCliente);

            cmd.Parameters.AddWithValue(
                "@IdSolicitante",
                (object?)orden.IdSolicitante ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IdObra",
                (object?)orden.IdObra ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IdCotizacion",
                (object?)orden.IdCotizacion ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@Fecha",
                (object?)orden.Fecha ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@Monto",
                (object?)orden.Monto ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IVA",
                (object?)orden.IVA ?? DBNull.Value);

            conn.Open();

            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Modificar(OrdenDeCompra orden)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spModificarOrdenDeCompra",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Id",
                orden.Id);

            cmd.Parameters.AddWithValue(
                "@Numero",
                orden.Numero);

            cmd.Parameters.AddWithValue(
                "@IdCliente",
                orden.IdCliente);

            cmd.Parameters.AddWithValue(
                "@IdSolicitante",
                (object?)orden.IdSolicitante ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IdObra",
                (object?)orden.IdObra ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IdCotizacion",
                (object?)orden.IdCotizacion ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@Fecha",
                (object?)orden.Fecha ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@Monto",
                (object?)orden.Monto ?? DBNull.Value);

            cmd.Parameters.AddWithValue(
                "@IVA",
                (object?)orden.IVA ?? DBNull.Value);

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
                new SqlCommand(
                    "AppData.spEliminarOrdenDeCompra",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Id",
                id);

            conn.Open();

            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
