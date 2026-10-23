using APIGesCom.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services;

public class ClienteService : IClienteService
{
    private readonly IConfiguration _config;
    public ClienteService(IConfiguration config) => _config = config;

    public List<Cliente> ListarTodos()
    {
        var lista = new List<Cliente>();
        using var conn = new SqlConnection(_config.GetConnectionString("GesComDemo"));
        using var cmd = new SqlCommand("AppData.spListarCliente", conn) { CommandType = CommandType.StoredProcedure };
        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            lista.Add(new Cliente
            {
                Id = Convert.ToInt64(reader["Id"]), Nombre = reader["Nombre"].ToString()!,
                CUIT = reader["CUIT"].ToString()!, Localidad = reader["Localidad"]?.ToString(),
                Calle = reader["Calle"]?.ToString(), Numero = reader["Numero"]?.ToString(),
                Activo = Convert.ToBoolean(reader["Activo"])
            });
        }
        return lista;
    }

    public Task<ResultadoOperacion> InsertarAsync(Cliente cliente) => EjecutarAsync("AppData.spInsertarCliente", command =>
    {
        command.Parameters.Add("@Nombre", SqlDbType.NVarChar, 50).Value = cliente.Nombre;
        command.Parameters.Add("@CUIT", SqlDbType.VarChar, 11).Value = cliente.CUIT;
        command.Parameters.Add("@Localidad", SqlDbType.NVarChar, 50).Value = (object?)cliente.Localidad ?? DBNull.Value;
        command.Parameters.Add("@Calle", SqlDbType.NVarChar, 100).Value = (object?)cliente.Calle ?? DBNull.Value;
        command.Parameters.Add("@Numero", SqlDbType.NVarChar, 10).Value = (object?)cliente.Numero ?? DBNull.Value;
    });

    public Task<ResultadoOperacion> ModificarAsync(Cliente cliente) => EjecutarAsync("AppData.spModificarCliente", command =>
    {
        command.Parameters.AddWithValue("@Id", cliente.Id); command.Parameters.AddWithValue("@Nombre", cliente.Nombre);
        command.Parameters.AddWithValue("@CUIT", cliente.CUIT); command.Parameters.AddWithValue("@Localidad", (object?)cliente.Localidad ?? DBNull.Value);
        command.Parameters.AddWithValue("@Calle", (object?)cliente.Calle ?? DBNull.Value); command.Parameters.AddWithValue("@Numero", (object?)cliente.Numero ?? DBNull.Value);
    });

    public Task<ResultadoOperacion> EliminarAsync(long id) => EjecutarAsync("AppData.spEliminarCliente", command => command.Parameters.AddWithValue("@Id", id));

    private async Task<ResultadoOperacion> EjecutarAsync(string procedimiento, Action<SqlCommand> cargarParametros)
    {
        await using var conn = new SqlConnection(_config.GetConnectionString("GesComDemo"));
        await using var command = new SqlCommand(procedimiento, conn) { CommandType = CommandType.StoredProcedure };
        cargarParametros(command);
        return await ResultadoOperacionSql.EjecutarAsync(command);
    }
}
