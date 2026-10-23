using APIGesCom.Models;
using Microsoft.Data.SqlClient;

namespace APIGesCom.Services;

internal static class ResultadoOperacionSql
{
    public static async Task<ResultadoOperacion> EjecutarAsync(SqlCommand command)
    {
        try
        {
            await command.Connection!.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return ResultadoOperacion.Fallo(
                    "SIN_RESPUESTA",
                    "La operación no devolvió una respuesta de la base de datos.");
            }

            var ok = reader["Ok"] != DBNull.Value && Convert.ToBoolean(reader["Ok"]);
            var id = reader["Id"] == DBNull.Value
                ? (long?)null
                : Convert.ToInt64(reader["Id"]);
            var mensaje = reader["Mensaje"]?.ToString()
                ?? "La operación no devolvió un mensaje.";

            return ok
                ? ResultadoOperacion.Exito(id, mensaje)
                : ResultadoOperacion.Fallo(ClasificarMensaje(mensaje), mensaje);
        }
        catch (SqlException ex)
        {
            return ResultadoOperacion.Fallo(
                ClasificarExcepcion(ex),
                MensajeSeguro(ex));
        }
        catch
        {
            return ResultadoOperacion.Fallo(
                "INTERNO",
                "Ocurrió un error interno al ejecutar la operación.");
        }
    }

    private static string ClasificarExcepcion(SqlException exception) => exception.Number switch
    {
        2601 or 2627 => "DUPLICADO",
        547 => "REFERENCIA_INVALIDA",
        _ => "INTERNO"
    };

    private static string ClasificarMensaje(string mensaje)
    {
        var texto = mensaje.ToLowerInvariant();

        if (texto.Contains("duplicate") || texto.Contains("duplicad") || texto.Contains("unique"))
            return "DUPLICADO";

        if (texto.Contains("inexistente"))
            return "NO_ENCONTRADO";

        if (texto.Contains("foreign key") || texto.Contains("referencia") || texto.Contains("formato"))
            return "VALIDACION";

        return "VALIDACION";
    }

    private static string MensajeSeguro(SqlException exception) => exception.Number switch
    {
        2601 or 2627 => "Ya existe un registro con esos datos únicos.",
        547 => "No se puede completar la operación porque una referencia no es válida.",
        _ => "Ocurrió un error interno al ejecutar la operación."
    };
}
