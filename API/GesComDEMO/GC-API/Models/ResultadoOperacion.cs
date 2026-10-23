namespace APIGesCom.Models;

public sealed class ResultadoOperacion
{
    public bool Ok { get; init; }
    public long? Id { get; init; }
    public string Mensaje { get; init; } = string.Empty;
    public string Codigo { get; init; } = string.Empty;

    public static ResultadoOperacion Exito(long? id, string mensaje) => new()
    {
        Ok = true,
        Id = id,
        Mensaje = mensaje,
        Codigo = "OK"
    };

    public static ResultadoOperacion Fallo(string codigo, string mensaje) => new()
    {
        Ok = false,
        Mensaje = mensaje,
        Codigo = codigo
    };
}
