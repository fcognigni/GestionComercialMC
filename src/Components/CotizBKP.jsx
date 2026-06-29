import React, { useState } from 'react';
import { useEffect } from 'react';
import '../Styles/Cotizacion.css'

export default function FormCotizacion() {
  const [errors, setErrors] = useState({});

  const [clientes, setClientes] =
        useState([]);
  const [errorCliente, setErrorCliente] =
        useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Creamos el objeto FormData a partir del formulario nativo
    const formData = new FormData(e.target);
    
    // Obtenemos los valores individuales para validar
    const data = {
      numero: formData.get('numero'),
      idCliente: formData.get('idCliente'),
      idObra: formData.get('idObra'),
      referencia: formData.get('referencia'),
      descripcion: formData.get('descripcion'),
      fecha: formData.get('fecha'),
      monto: formData.get('monto'),
      formal: formData.get('formal') // Al ser un checkbox, vendrá "on" o null
    };

    // Objeto temporal para acumular errores de validación
    const newErrors = {};

    // 1. Validar Número (int)
    if (!data.numero || isNaN(data.numero) || !Number.isInteger(Number(data.numero))) {
      newErrors.numero = '* El número debe ser un número entero válido.';
    }
    // 2. Validar IdCliente (bigint)
    if (!data.idCliente || isNaN(data.idCliente)) {
      newErrors.idCliente = '* Debe seleccionar un cliente válido.';
    }
    // 3. Validar IdObra (bigint)
    if (!data.idObra || isNaN(data.idObra)) {
      newErrors.idObra = '* Debe seleccionar una obra válida.';
    }
    // 4. Validar Referencia (nvarchar 100)
    if (!data.referencia || data.referencia.trim() === '') {
      newErrors.referencia = '* La referencia es obligatoria.';
    } else if (data.referencia.length > 100) {
      newErrors.referencia = '* Máximo 100 caracteres.';
    }
    // 5. Validar Descripcion (nvarchar 1000)
    if (data.descripcion && data.descripcion.length > 1000) {
      newErrors.descripcion = '* Máximo 1000 caracteres.';
    }
    // 6. Validar Fecha (datetime)
    if (!data.fecha) {
      newErrors.fecha = '* La fecha y hora es obligatoria.';
    }
    // 7. Validar Monto (decimal 18,2)
    if (!data.monto || isNaN(data.monto) || Number(data.monto) <= 0) {
      newErrors.monto = '* Ingrese un monto decimal válido mayor a 0.';
    }

    // Si hay errores, frenamos la ejecución y los mostramos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si pasa las validaciones, limpiamos errores
    setErrors({});

    /* Ajuste para el tipo BIT (Boolean): 
      FormData maneja strings. Si el checkbox está marcado envía "on", si no, no se envía. 
      Lo normalizamos a 1 o 0 (o true/false) antes de mandarlo a la API/Backend.
    */
    formData.set('formal', data.formal === 'on' ? '1' : '0');

    // --- AQUÍ ENVIÁS TU FORMDATA AL BACKEND ---
    console.log('¡Validación exitosa! Enviando FormData...');
    // Ejemplo de fetch:
    // fetch('/api/cotizaciones', { method: 'POST', body: formData })
  };

  const cargarComboClientes = async () => {

        try {

            setLoading(true);

            const response =
                await fetch(
                    "https://localhost:7208/api/Cliente"
                );

            if (!response.ok) {
                throw new Error(
                    "Error al obtener clientes"
                );
            }

            const data =
                await response.json();

            console.log(data)
            setClientes(data);

        } catch (err) {

            setErrorCliente(err.message);

        }
    };

  return (
    <div className="content-card">
      <h3>Nueva Cotización</h3>
      
      <form onSubmit={handleSubmit} className="form-cotizacion" noValidate>
        <div className="form-grid">
          
          {/* Número */}
          <div className="form-group">
            <label htmlFor="numero">Número de Cotización</label>
            <input type="number" id="numero" name="numero" className={errors.numero ? 'input-error' : ''} />
            {errors.numero && <span className="error-msg">{errors.numero}</span>}
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">Fecha y Hora</label>
            <input type="datetime-local" id="fecha" name="fecha" className={errors.fecha ? 'input-error' : ''} />
            {errors.fecha && <span className="error-msg">{errors.fecha}</span>}
          </div>

          {/* IdCliente (Simulado con un select) */}
          <div className="form-group">
            <label htmlFor="idCliente">Cliente</label>
            <select id="idCliente" name="idCliente" className={errors.idCliente ? 'input-error' : ''}>        
            {clientes.map ( c => 
              <option value= {c.Id}>{c.Nombre}</option>)}
            </select>
            {errors.idCliente && <span className="error-msg">{errors.idCliente}</span>}
          </div>

          {/* IdObra (Simulado con un select) */}
          <div className="form-group">
            <label htmlFor="idObra">Obra</label>
            <select id="idObra" name="idObra" className={errors.idObra ? 'input-error' : ''}>
              <option value="">Seleccione una obra...</option>
              <option value="101">Obra Centro (ID: 101)</option>
              <option value="102">Obra Alvear (ID: 102)</option>
            </select>
            {errors.idObra && <span className="error-msg">{errors.idObra}</span>}
          </div>

          {/* Referencia */}
          <div className="form-group col-span-2">
            <label htmlFor="referencia">Referencia</label>
            <input type="text" id="referencia" name="referencia" placeholder="Ej: Materiales gruesos etapa 1" className={errors.referencia ? 'input-error' : ''} />
            {errors.referencia && <span className="error-msg">{errors.referencia}</span>}
          </div>

          {/* Monto */}
          <div className="form-group">
            <label htmlFor="monto">Monto ($)</label>
            <input type="number" step="0.01" id="monto" name="monto" placeholder="0.00" className={errors.monto ? 'input-error' : ''} />
            {errors.monto && <span className="error-msg">{errors.monto}</span>}
          </div>

          {/* Formal (Bit / Checkbox) */}
          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input type="checkbox" id="formal" name="formal" />
              <span className="checkmark"></span>
              Es una cotización formal
            </label>
          </div>

          {/* Descripción */}
          <div className="form-group col-span-2">
            <label htmlFor="descripcion">Descripción detallada</label>
            <textarea id="descripcion" name="descripcion" rows="3" placeholder="Detalles opcionales de la cotización..." className={errors.descripcion ? 'input-error' : ''}></textarea>
            {errors.descripcion && <span className="error-msg">{errors.descripcion}</span>}
          </div>

        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">Guardar Cotización</button>
        </div>
      </form>
    </div>
  );
}
