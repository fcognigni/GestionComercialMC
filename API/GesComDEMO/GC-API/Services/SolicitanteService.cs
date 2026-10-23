using APIGesCom.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services;

public class SolicitanteService : ISolicitanteService
{
    private readonly IConfiguration _config;
    public SolicitanteService(IConfiguration config) => _config = config;

    public List<Solicitante> ListarTodos()
    {
        var lista = new List<Solicitante>();
        using var conn = new SqlConnection(_config.GetConnectionString("GesComDemo"));
        using var cmd = new SqlCommand("AppData.spListarSolicitante", conn) { CommandType = CommandType.StoredProcedure };
        conn.Open(); using var reader = cmd.ExecuteReader();
        while (reader.Read()) lista.Add(Mapear(reader));
        return lista;
    }

    public Solicitante? ListarPorId(long id)
    {
        using var conn = new SqlConnection(_config.GetConnectionString("GesComDemo"));
        using var cmd = new SqlCommand("AppData.spListarSolicitanteId", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddWithValue("@Id", id); conn.Open(); using var reader = cmd.ExecuteReader();
        return reader.Read() ? Mapear(reader) : null;
    }

    public Task<ResultadoOperacion> InsertarAsync(Solicitante solicitante) => EjecutarAsync("AppData.spInsertarSolicitante", command =>
    {
        command.Parameters.AddWithValue("@Nombre", solicitante.Nombre); command.Parameters.AddWithValue("@IdCliente", solicitante.IdCliente);
        command.Parameters.AddWithValue("@Telefono", (object?)solicitante.Telefono ?? DBNull.Value); command.Parameters.AddWithValue("@Email", (object?)solicitante.Email ?? DBNull.Value);
    });

    public Task<ResultadoOperacion> ModificarAsync(Solicitante solicitante) => EjecutarAsync("AppData.spModificarSolicitante", command =>
    {
        command.Parameters.AddWithValue("@Id", solicitante.Id); command.Parameters.AddWithValue("@Nombre", solicitante.Nombre);
        command.Parameters.AddWithValue("@IdCliente", solicitante.IdCliente); command.Parameters.AddWithValue("@Telefono", (object?)solicitante.Telefono ?? DBNull.Value);
        command.Parameters.AddWithValue("@Email", (object?)solicitante.Email ?? DBNull.Value);
    });

    public Task<ResultadoOperacion> EliminarAsync(long id) => EjecutarAsync("AppData.spEliminarSolicitante", command => command.Parameters.AddWithValue("@Id", id));

    private static Solicitante Mapear(SqlDataReader reader) => new()
    {
        Id = Convert.ToInt32(reader["Id"]), Nombre = reader["Nombre"].ToString()!, IdCliente = Convert.ToInt64(reader["IdCliente"]),
        Telefono = reader["Telefono"] == DBNull.Value ? null : reader["Telefono"].ToString(), Email = reader["Email"] == DBNull.Value ? null : reader["Email"].ToString()
    };

    private async Task<ResultadoOperacion> EjecutarAsync(string procedimiento, Action<SqlCommand> cargarParametros)
    {
        await using var conn = new SqlConnection(_config.GetConnectionString("GesComDemo"));
        await using var command = new SqlCommand(procedimiento, conn) { CommandType = CommandType.StoredProcedure };
        cargarParametros(command); return await ResultadoOperacionSql.EjecutarAsync(command);
    }
}
