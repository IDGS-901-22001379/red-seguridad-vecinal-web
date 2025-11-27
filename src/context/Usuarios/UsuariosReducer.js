import { USUARIOS_ACTIONS } from "./ActionsTypes";

export default function UsuariosReducer(state, action) {
    switch (action.type) {
<<<<<<< HEAD
        case USUARIOS_ACTIONS.LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case USUARIOS_ACTIONS.SAVING:
            return {
                ...state,
                saving: true,
                error: null
            };

=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
        case USUARIOS_ACTIONS.LISTAR:
            return {
                ...state,
                usuarios: action.payload,
<<<<<<< HEAD
                loading: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
                error: null
            };

        case USUARIOS_ACTIONS.OBTENER:
            return {
                ...state,
                usuarioSeleccionado: action.payload,
<<<<<<< HEAD
                loading: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
                error: null
            };

        case USUARIOS_ACTIONS.REGISTRAR:
            return {
                ...state,
                usuarios: [...state.usuarios, action.payload],
<<<<<<< HEAD
                saving: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
                error: null
            };

        case USUARIOS_ACTIONS.ACTUALIZAR:
            return {
                ...state,
                usuarios: state.usuarios.map((u) =>
                    u.usuarioID === action.payload.usuarioID ? action.payload : u
                ),
<<<<<<< HEAD
                saving: false,
                error: null
            };

        case USUARIOS_ACTIONS.ELIMINAR:
            return {
                ...state,
                usuarios: state.usuarios.filter(
                    (u) => u.usuarioID !== action.payload
                ),
                saving: false,
                error: null
            };

        case USUARIOS_ACTIONS.REACTIVAR:
            return {
                ...state,
                usuarios: state.usuarios.map((u) =>
                    u.usuarioID === action.payload.usuarioID ? action.payload : u
                ),
                saving: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
                error: null
            };

        case USUARIOS_ACTIONS.TIPOS_USUARIO:
            return {
                ...state,
                tiposUsuario: action.payload,
<<<<<<< HEAD
                loading: false,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
                error: null
            };

        case USUARIOS_ACTIONS.ERROR:
            return {
                ...state,
<<<<<<< HEAD
                error: action.payload,
                loading: false,
                saving: false
            };

        case USUARIOS_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
=======
                error: action.payload
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
            };

        default:
            return state;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
