export interface ConsultaModelo {
    "contrato": {
        "id": any;
        "cliente": any;
        "fecha_inicio": any;
        "estado": any;
        "plan": any;
        "valor": any;
        "soporte": any;
        "cuotas": any;
    },
    "cliente": {
        "documento": any;
        "nombre_completo": any;
        "codigo": any;
        "correo": any;
        "direccion": any;
        "ciudad": any;
        "grado": any;
        "celular": any;
        "telefono": any;
        "dependencia": any;
        "observaciones": any;
    },
    "beneficiarios": [
        {
            "secuencia": any;
            "contrato": any;
            "nombre": any;
            "edad": any;
            "parentesco": any;
            "adicional": any;
            "contacto": any;
            "emoji": any;
        }
    ]
}