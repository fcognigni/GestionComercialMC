using APIGesCom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace APIGesCom.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IConfiguration _config;

        public ClienteService(IConfiguration config)
        {
            _config = config;
        }

        public List<Cliente> ListarTodos()
        {
            List<Cliente> lista = new List<Cliente>();

            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spListarCliente", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            conn.Open();

            using SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                Cliente cliente = new Cliente();

                cliente.Id = Convert.ToInt64(reader["Id"]);
                cliente.Nombre = reader["Nombre"].ToString();
                cliente.CUIT = reader["CUIT"].ToString();
                cliente.Localidad = reader["Localidad"].ToString();
                cliente.Calle = reader["Calle"].ToString();
                cliente.Numero = (reader["Numero"]).ToString();
                cliente.Activo = Convert.ToBoolean(reader["Activo"]);

                lista.Add(cliente);
            }

            return lista;
        }

        public long Insertar(Cliente cliente)
        {
            string connString =
                _config.GetConnectionString("GesComDemo");

            using SqlConnection conn =
                new SqlConnection(connString);

            using SqlCommand cmd =
                new SqlCommand("AppData.spInsertarCliente", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.
                Add("@Nombre", SqlDbType.NVarChar, 50).Value = cliente.Nombre;
            cmd.Parameters.
                Add("@CUIT", SqlDbType.VarChar, 11).Value = cliente.CUIT;
            cmd.Parameters.
                Add("@Localidad", SqlDbType.NVarChar, 50).Value = cliente.Localidad ?? (object)DBNull.Value;
            cmd.Parameters.
                Add("@Calle", SqlDbType.NVarChar, 100).Value = cliente.Calle ?? (object)DBNull.Value;
            cmd.Parameters.AddWithValue(
                "@Numero",
                cliente.Numero ?? (object)DBNull.Value
            );

            conn.Open();

            return Convert.ToInt64(cmd.ExecuteScalar());

        }

        public async Task<ActionResult> ModificarCliente(Cliente cliente)
        {
            try
            {
                string connString =
                _config.GetConnectionString("GesComDemo");

                using SqlConnection conn =
                    new SqlConnection(connString);
                {
                    await conn.OpenAsync();

                    using (SqlCommand command = new SqlCommand("AppData.spModificarCliente", conn))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Id", cliente.Id);
                        command.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                        command.Parameters.AddWithValue("@CUIT", cliente.CUIT);
                        command.Parameters.AddWithValue("@Localidad",
                            (object?)cliente.Localidad ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Calle",
                            (object?)cliente.Calle ?? DBNull.Value);
                        command.Parameters.AddWithValue("@Numero",
                            (object?)cliente.Numero ?? DBNull.Value);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                return new OkResult();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }


        public async Task<ActionResult> EliminarCliente(long id)
        {
            try
            {
                string connString =
                _config.GetConnectionString("GesComDemo");

                using SqlConnection conn =
                    new SqlConnection(connString);
                {
                    await conn.OpenAsync();

                    using (SqlCommand command = new SqlCommand("AppData.spEliminarCliente", conn))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@Id", id);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                return new OkResult();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}
