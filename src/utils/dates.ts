export const getLastDate = (patient: any) => {
    console.log('patient', patient)
    if ("dates" in patient) {
        if (patient.dates.length > 0) {
            // Obtener la fecha más reciente
            const fechaMasReciente = patient.dates.reduce((anterior: any, actual: any) => {
                const fechaActual = new Date(actual.start);
                if (!anterior || fechaActual > anterior) {
                    return fechaActual;
                }
                return anterior;
            }, null);

            console.log('fmr', fechaMasReciente)

            // Obtener todos los objetos con la fecha más reciente
            const objetosMasRecientes = patient.dates.filter((objeto: any) => new Date(objeto.start).getTime() === fechaMasReciente.getTime());
            console.log('objeto', objetosMasRecientes)
            return objetosMasRecientes
        }
        return false
    }
    return false
}


export const groupDates = (dates: any) => {
    if (dates.length > 0) {
        const objetosPorFecha = dates.reduce((map:any, objeto:any) => {
            const fecha = objeto.start.split('T')[0];
            //const fecha = objeto.start;
            if (map.has(fecha)) {
                map.get(fecha).push(objeto);
            } else {
                map.set(fecha, [objeto]);
            }
            return map;
        }, new Map());

        // Convertir el objeto de mapeo en un arreglo de grupos de objetos
        const grupos = Array.from(objetosPorFecha.values());

        console.log('grupos', grupos);
        return grupos
    }
    return false
}
