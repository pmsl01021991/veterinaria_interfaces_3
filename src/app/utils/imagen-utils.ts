export const comprimirImagen = (
  archivo: File,
  maxWidth = 1000,
  calidad = 0.75
): Promise<string> => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = (evento) => {

      const imagen = new Image();

      imagen.onload = () => {

        let width = imagen.width;
        let height = imagen.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const contexto = canvas.getContext('2d');

        if (!contexto) {
          reject(new Error('No se pudo crear el contexto del canvas.'));
          return;
        }

        contexto.drawImage(
          imagen,
          0,
          0,
          width,
          height
        );

        const base64 = canvas.toDataURL(
          'image/jpeg',
          calidad
        );

        resolve(base64);
      };

      imagen.onerror = () => {
        reject(new Error('No se pudo cargar la imagen.'));
      };

      imagen.src = evento.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('No se pudo leer el archivo.'));
    };

    reader.readAsDataURL(archivo);
  });
};