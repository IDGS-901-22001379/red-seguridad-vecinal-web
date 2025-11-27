import React, { createContext, useState, useContext, useEffect } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
<<<<<<< HEAD
        console.error("Error parsing stored user:", error);
=======
        alert("Error", error);
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/Usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
<<<<<<< HEAD
        let errorMessage = "Credenciales incorrectas";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Si no es JSON, intentar leer como texto
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
=======
        const errorData = await response.text();
        throw new Error(errorData || "Credenciales incorrectas");
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
      }

      const data = await response.json();

<<<<<<< HEAD
      // Validar rol permitido
      const tiposPermitidos = ["Admin", "Guardia"];
      if (!tiposPermitidos.includes(data.tipoUsuario)) {
        // Retornar objeto con error específico
        return {
          success: false,
          error: "Acceso restringido. Solo personal autorizado puede acceder.",
          errorType: "ROLE_DENIED",
        };
      }

=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
      const userData = {
        id: data.id,
        nombre: data.nombre,
        apellidoP: data.apellidoP,
        apellidoM: data.apellidoM,
        email,
        tipoUsuario: data.tipoUsuario,
        descripcion: data.descripcion,
        firebaseID: data.firebaseID,
        online: true,
      };

      setUser(userData);
<<<<<<< HEAD
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        error: error.message || "Error de conexión con el servidor",
        errorType: "AUTH_ERROR",
      };
=======

      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      alert(error.message || "Error de conexión con el servidor");
      return false;
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

<<<<<<< HEAD
  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.tipoUsuario);
  };

=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
<<<<<<< HEAD
    hasRole,
=======
>>>>>>> d865f279f1327399bfaf9066fade0b791022c98d
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
