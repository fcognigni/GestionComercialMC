using APIGesCom.Models;
using GC_API.Models;
using Microsoft.Data.SqlClient;
using System.Data;

public class CotizacionService : ICotizacionService
{
    private readonly IConfiguration _config;

    public CotizacionService(IConfiguration config)
    {
        _config = config;
    }

    public long Insertar(Cotizacion cotizacion)
    {
        string connString =
            _config.GetConnectionString("GesComDemo");

        using SqlConnection conn =
            new SqlConnection(connString);

        using SqlCommand cmd =
            new SqlCommand("AppData.spInsertarCotizacion", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@Prefijo", cotizacion.Prefijo);
        cmd.Parameters.AddWithValue("@Numero", cotizacion.Numero);
        cmd.Parameters.AddWithValue("@IdCliente", cotizacion.IdCliente);
        cmd.Parameters.AddWithValue("@IdObra", (object?)cotizacion.IdObra ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@IdSolicitante", (object?)cotizacion.IdSolicitante ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Referencia", cotizacion.Referencia);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)cotizacion.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Monto", cotizacion.Monto);
        cmd.Parameters.AddWithValue("@Formal", cotizacion.Formal);

        conn.Open();

        return Convert.ToInt64(cmd.ExecuteScalar());
    }

    public CotizacionDTO? ListarPorId(long id)
    {
        string connString =
            _config.GetConnectionString("GesComDemo");

        using SqlConnection conn =
            new SqlConnection(connString);

        using SqlCommand cmd =
            new SqlCommand("AppData.spListarCotizacionId", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@Id", id);

        conn.Open();

        using SqlDataReader reader =
            cmd.ExecuteReader();

        if (reader.Read())
        {
            return Mapear(reader);
        }

        return null;
    }

    public async Task<ResultadoPaginado<CotizacionDTO>>
            ListarAsync(
            CotizacionFiltro filtro)
    {
        List<CotizacionDTO> lista = new();

        int totalRegistros = 0;

        string connString =
            _config.GetConnectionString("GesComDemo");

        await using SqlConnection conn =
            new SqlConnection(connString);

        await using SqlCommand cmd =
            new SqlCommand(
                "AppData.spListarCotizaciones",
                conn);

        cmd.CommandType =
            CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue(
            "@IdObra",
            (object?)filtro.IdObra ?? DBNull.Value
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
            CotizacionDTO>
        {
            Items = lista,

            TotalRegistros =
                totalRegistros,

            Page = filtro.Page,

            PageSize = filtro.PageSize
        };
    }


    public bool Modificar(Cotizacion cotizacion)
    {
        string connString =
            _config.GetConnectionString("GesComDemo");

        using SqlConnection conn =
            new SqlConnection(connString);

        using SqlCommand cmd =
            new SqlCommand("AppData.spModificarCotizacion", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@Id", cotizacion.Id);
        cmd.Parameters.AddWithValue("@Prefijo", cotizacion.Prefijo);
        cmd.Parameters.AddWithValue("@Numero", cotizacion.Numero);
        cmd.Parameters.AddWithValue("@IdCliente", cotizacion.IdCliente);
        cmd.Parameters.AddWithValue("@IdObra", (object?)cotizacion.IdObra ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@IdSolicitante", (object?)cotizacion.IdSolicitante ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Referencia", cotizacion.Referencia);
        cmd.Parameters.AddWithValue("@Descripcion", (object?)cotizacion.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@Monto", cotizacion.Monto);
        cmd.Parameters.AddWithValue("@Formal", cotizacion.Formal);

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
            new SqlCommand("AppData.spEliminarCotizacion", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@Id", id);

        conn.Open();

        return cmd.ExecuteNonQuery() > 0;
    }

    private static CotizacionDTO Mapear(SqlDataReader reader)
    {
        return new CotizacionDTO
        {
            Id = Convert.ToInt64(reader["Id"]),
            Prefijo = Convert.ToInt32(reader["Prefijo"]),
            Numero = Convert.ToInt32(reader["Numero"]),
            IdCliente = Convert.ToInt64(reader["IdCliente"]),
            NombreCliente = reader["NombreCliente"].ToString(),
            IdObra = reader["IdObra"] == DBNull.Value
                ? null
                : Convert.ToInt64(reader["IdObra"]),
            NombreSolicitante = reader["IdSolicitante"] == DBNull.Value
                ? null
                : reader["IdSolicitante"].ToString(),
            Referencia = reader["Referencia"].ToString()!,
            Fecha = Convert.ToDateTime(reader["Fecha"]),
            Monto = Convert.ToDecimal(reader["Monto"]),
        };
    }
}
