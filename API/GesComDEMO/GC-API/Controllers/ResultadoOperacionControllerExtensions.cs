using APIGesCom.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIGesCom.Controllers;

public static class ResultadoOperacionControllerExtensions
{
    public static ActionResult ResponderOperacion(
        this ControllerBase controller,
        ResultadoOperacion resultado,
        bool creado = false)
    {
        if (resultado.Ok)
        {
            return creado
                ? controller.StatusCode(StatusCodes.Status201Created, resultado)
                : controller.Ok(resultado);
        }

        return resultado.Codigo switch
        {
            "DUPLICADO" => controller.Conflict(resultado),
            "NO_ENCONTRADO" => controller.NotFound(resultado),
            "INTERNO" or "SIN_RESPUESTA" => controller.StatusCode(
                StatusCodes.Status500InternalServerError,
                resultado),
            _ => controller.BadRequest(resultado)
        };
    }
}
