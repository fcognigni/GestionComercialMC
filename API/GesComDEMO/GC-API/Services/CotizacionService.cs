using APIGesCom.Models;
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

    public Cotizacion? ListarPorId(long id)
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

    public List<Cotizacion> ListarTodos()
    {
        List<Cotizacion> lista = new();

        string connString =
            _config.GetConnectionString("GesComDemo");

        using SqlConnection conn =
            new SqlConnection(connString);

        using SqlCommand cmd =
            new SqlCommand("AppData.spListarCotizacion", conn);

        cmd.CommandType = CommandType.StoredProcedure;

        conn.Open();

        using SqlDataReader reader =
            cmd.ExecuteReader();

        while (reader.Read())
        {
            lista.Add(Mapear(reader));
        }

        return lista;
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

    private static Cotizacion Mapear(SqlDataReader reader)
    {
        return new Cotizacion
        {
            Id = Convert.ToInt64(reader["Id"]),
            Numero = Convert.ToInt32(reader["Numero"]),
            IdCliente = Convert.ToInt64(reader["IdCliente"]),
            IdObra = reader["IdObra"] == DBNull.Value
                ? null
                : Convert.ToInt64(reader["IdObra"]),
            IdSolicitante = reader["IdSolicitante"] == DBNull.Value
                ? null
                : Convert.ToInt64(reader["IdSolicitante"]),
            Referencia = reader["Referencia"].ToString()!,
            Descripcion = reader["Descripcion"] == DBNull.Value
                ? null
                : reader["Descripcion"].ToString(),
            Fecha = Convert.ToDateTime(reader["Fecha"]),
            Monto = Convert.ToDecimal(reader["Monto"]),
            Formal = Convert.ToBoolean(reader["Formal"])
        };
    }
}
