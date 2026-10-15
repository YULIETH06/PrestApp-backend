// Datos de un cliente después de validarlos y limpiarlos.
// Se usan tanto para crear como para editar un cliente.
export interface ClientFormData {
    identificationTypeId: number;
    identificationNumber: string;
    fullName: string;
    phone: string;
    secondaryPhone: string | null;
    address: string;
    neighborhood: string;
    notes: string | null;
}

// Estados por los que se puede filtrar el listado de clientes.
export type ClientStatusFilter =
    | "active"
    | "inactive"
    | "all";

// Filtros que recibe el listado de clientes.
export interface ClientFilters {
    search: string;
    status: ClientStatusFilter;
}

// Resultado de validar los datos de un cliente.
// Si hay un error, se devuelve el mensaje; si no, los datos limpios.
export type ClientValidationResult =
    | {
        isValid: false;
        message: string;
    }
    | {
        isValid: true;
        data: ClientFormData;
    };
