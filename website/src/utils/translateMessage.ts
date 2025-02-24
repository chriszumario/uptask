const translations: { [key: string]: string } = {
    'Project created successfully': 'Proyecto creado con éxito',
    'An error occurred': 'Ocurrió un error',
    'Invalid credentials': 'Credenciales inválidas',
};

// Función para traducir
export const translateMessage = (message: string) => {
    return translations[message] || message;
};
