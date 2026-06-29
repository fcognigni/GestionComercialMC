using APIGesCom.Models;
using System.Xml.Linq;

namespace GC_API.Models
{
    public class ObraEstadoComercialDTO : ObraEstadoComercial
{
    // 1. Este campo recibe el string de la base de datos (ej: "3,4,5")
    public string Sucesores { get; set; }

    public string NombreEstadoComercial { get; set; }

    // 2. Propiedad inteligente que transforma el string en una lista de enteros para el Frontend
    public List<int> SucesoresInt
    {
        get
        {
            // Si el string está vacío o es nulo, devolvemos una lista vacía
            if (string.IsNullOrWhiteSpace(Sucesores))
                return new List<int>();

            // Separamos por comas, convertimos cada fragmento a int y lo hacemos lista
            return Sucesores.Split(',')
                            .Select(int.Parse)
                            .ToList();
        }
        set
        {
            // En caso de que el frontend te mande una lista de ints, 
            // esto la vuelve a transformar en string ("3,4,5") para la base de datos
            Sucesores = value != null ? string.Join(",", value) : null;
        }
    }
}
}
