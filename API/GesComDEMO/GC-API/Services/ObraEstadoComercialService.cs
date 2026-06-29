using APIGesCom.Models;
using GC_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services
{
    public class ObraEstadoComercialService
        : IObraEstadoComercialService
    {
        private readonly IConfiguration _config;

        public ObraEstadoComercialService(
            IConfiguration config)
        {
            _config = config;
        }

        public async Task<IEnumerable<ObraEstadoComercialDTO>>
            ListarTodosAsync()
        {
            List<ObraEstadoComercialDTO> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            await using SqlConnection conn =
                new SqlConnection(connString);

            await using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spListarObraEstadoComercial",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            await conn.OpenAsync();

            await using SqlDataReader reader =
                await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(Mapear(reader));
            }

            return lista;
        }

        public async Task<IEnumerable<ObraEstadoComercialDTO>>
            ListarPorObraAsync(long idObra)
        {
            List<ObraEstadoComercialDTO> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            await using SqlConnection conn =
                new SqlConnection(connString);

            await using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spListarObraEstadoComercialPorObra",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Id",
                idObra);

            await conn.OpenAsync();

            await using SqlDataReader reader =
                await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(Mapear(reader));
            }

            return lista;
        }

        public async Task<IEnumerable<ObraEstadoComercial>>
            ListarPorEstadoComercialAsync(long idEstado)
        {
            List<ObraEstadoComercial> lista = new();

            string connString =
                _config.GetConnectionString("GesComDemo");

            await using SqlConnection conn =
                new SqlConnection(connString);

            await using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spListarObraEstadoComercialPorEstadoComercial",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Id",
                idEstado);

            await conn.OpenAsync();

            await using SqlDataReader reader =
                await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                lista.Add(Mapear(reader));
            }

            return lista;
        }

        public async Task<bool>
            InsertarAsync(
                ObraEstadoComercial estado)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            await using SqlConnection conn =
                new SqlConnection(connString);

            await using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spInsertarObraEstadoComercial",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@IdObra",
                estado.IdObra);

            cmd.Parameters.AddWithValue(
                "@IdEstadoComercial",
                estado.IdEstadoComercial);

            cmd.Parameters.AddWithValue(
                "@Observaciones",
                (object?)estado.Observaciones ??
                DBNull.Value);

            await conn.OpenAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool>
            EliminarAsync(long id)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            await using SqlConnection conn =
                new SqlConnection(connString);

            await using SqlCommand cmd =
                new SqlCommand(
                    "AppData.spEliminarObraEstadoComercial",
                    conn);

            cmd.CommandType =
                CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue(
                "@Id",
                id);

            await conn.OpenAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        private static ObraEstadoComercialDTO Mapear(
            SqlDataReader reader)
        {
            return new ObraEstadoComercialDTO
            {
                Id = Convert.ToInt64(reader["Id"]),

                IdObra =
                    Convert.ToInt64(reader["IdObra"]),

                IdEstadoComercial =
                    Convert.ToInt32(
                        reader["IdEstadoComercial"]),

                Fecha =
                    reader["Fecha"] == DBNull.Value
                    ? null
                    : Convert.ToDateTime(
                        reader["Fecha"]),

                Observaciones =
                    reader["Observaciones"] == DBNull.Value
                    ? null
                    : reader["Observaciones"].ToString(),

                Sucesores =
    reader["Sucesores"] == DBNull.Value
        ? null
        : reader["Sucesores"].ToString(),

                NombreEstadoComercial = reader["NombreEstadoComercial"].ToString()
            };
        }

        private static ObraEstadoComercial MapearPorObra(
    SqlDataReader reader)
        {
            return new ObraEstadoComercial
            {
                Id = Convert.ToInt64(reader["Id"]),

                IdObra = Convert.ToInt64(reader["IdObra"]),

                IdEstadoComercial =
                    Convert.ToInt32(
                        reader["IdEstadoComercial"]),

                Fecha =
                    reader["Fecha"] == DBNull.Value
                    ? null
                    : Convert.ToDateTime(
                        reader["Fecha"]),

                Observaciones =
                    reader["Observaciones"] == DBNull.Value
                    ? null
                    : reader["Observaciones"].ToString(),

            };
        }
    }
}