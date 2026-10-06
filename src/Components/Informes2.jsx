const [estadisticasCotizaciones, setEstadisticasCotizaciones] = useState([]);
const [estadisticasObras, setEstadisticasObras] = useState([]);

<TablaEstadisticasCotizaciones
    datos={estadisticasCotizaciones}
/>

<TablaEstadisticasObras
    datos={estadisticasObras}
/>

useEffect(() => {

    const cargarEstadisticas = async () => {
        try {

            const [resCotizaciones, resObras] = await Promise.all([
                fetch("https://localhost:xxxx/api/Estadisticas/cotizaciones"),
                fetch("https://localhost:xxxx/api/Estadisticas/obras")
            ]);

            const cotizaciones = await resCotizaciones.json();
            const obras = await resObras.json();

            setEstadisticasCotizaciones(cotizaciones);
            setEstadisticasObras(obras);

        } catch (error) {
            console.error("Error cargando estadísticas:", error);
        }
    };

    cargarEstadisticas();

}, []);