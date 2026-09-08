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


        public async Task<ResultadoPaginado<ObraEstadoComercialDTO>> 
            ListarAsync(
            ObraEstadoComercialFiltro filtro)
        {
            List<ObraEstadoComercialDTO> lista = new();

            int totalRegistros = 0;

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

            cmd.Parameters.AddWithValue(
                "@IdObra",
                (object?)filtro.IdObra ?? DBNull.Value
            );

            cmd.Parameters.AddWithValue(
                "@IdEstadoComercial",
                (object?)filtro.IdEstadoComercial
                ?? DBNull.Value
            );

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
                "@Page",
                filtro.Page
            );

            cmd.Parameters.AddWithValue(
                "@PageSize",
                filtro.PageSize
            );

            await conn.OpenAsync();

            await using SqlDataReader reader =
                await cmd.ExecuteReaderAsync();


            // Primer resultado:
            // los registros de la página

            while (await reader.ReadAsync())
            {
                lista.Add(Mapear(reader));
            }


            // Segundo resultado:
            // total de registros

            if (await reader.NextResultAsync())
            {
                if (await reader.ReadAsync())
                {
                    totalRegistros =
                        Convert.ToInt32(reader[0]);
                }
            }


            return new ResultadoPaginado<
                ObraEstadoComercialDTO>
            {
                Items = lista,

                TotalRegistros =
                    totalRegistros,

                Page = filtro.Page,

                PageSize = filtro.PageSize
            };
        }

        public async Task<int>
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

            return await cmd.ExecuteNonQueryAsync();
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

                Referencia =
                    reader["Referencia"] == DBNull.Value
                    ? null
                    : reader["Referencia"].ToString(),

                Cliente =
                    reader["Cliente"] == DBNull.Value
                    ? null
                    : reader["Cliente"].ToString(),

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