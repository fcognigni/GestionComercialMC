import React from "react";
import { useState } from "react";

const ClienteForm = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    cuit: "",
    localidad: "",
    calle: "",
    numero: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCliente({
      ...cliente,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:5001/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        alert("Cliente insertado correctamente");
      } else {
        alert("Error al insertar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={cliente.nombre}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>CUIT</label>
        <input
          type="text"
          name="cuit"
          value={cliente.cuit}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Localidad</label>
        <input
          type="text"
          name="localidad"
          value={cliente.localidad}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Calle</label>
        <input
          type="text"
          name="calle"
          value={cliente.calle}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Número</label>
        <input
          type="number"
          name="numero"
          value={cliente.numero}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        Guardar Cliente
      </button>
    </form>
  );
}

export default ClienteForm;
