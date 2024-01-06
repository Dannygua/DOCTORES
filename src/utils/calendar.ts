export const moreThanHour = (event: any) => {
     // Validar que la nueva cita tenga una diferencia máxima de una hora entre start y end
     const maxHourDifference = 1; // Máxima diferencia en horas permitida

     // Calcular la diferencia en milisegundos entre start y end
     const differenceInMilliseconds = event.end - event.start;
 
     // Convertir la diferencia de milisegundos a horas y minutos
     const hourDifference = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
     const minuteDifference = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
 
     // Verificar si la diferencia es mayor a la máxima permitida (1 hora)
     if (hourDifference > maxHourDifference || (hourDifference === 1 && minuteDifference > 0)) {
       // alert('La diferencia entre la hora de inicio y fin de la cita no puede ser mayor a una hora.');
       return true;
     }
}


export const outHour = (event: any) => {
  const horaInicio = 9; // 9:00 AM
  const horaFin = 17; // 5:00 PM
  const fechaCita = new Date(event.start);

  // Obtenemos la hora de la cita
  const horaCita = fechaCita.getHours();

  // Validamos si la hora de la cita está fuera del rango permitido
  if (horaCita < horaInicio || horaCita >= horaFin) {
    return true
  }
}