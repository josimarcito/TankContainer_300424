import supabase from "../../supabase";
import { Container } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if(!error){
      setKey(data.user.id);
      const session = JSON.stringify(data.user);
      sessionStorage.setItem(data.user.id, session);
      setLoading(false)
      navigate("/admin")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if(!error){
      navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAuth = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.getSession();

    if (!error && data.session != null) {
      const newKey = data.session.user.id;
      const newSession = JSON.stringify(data.session.user);
      setKey(newKey);
      sessionStorage.setItem(newKey, newSession);
      setLoading(false);
    }

    if(error){
      navigate("/");
      setLoading(false);
    }

    if (data.session === null) {
      setLoading(false);
      navigate("/");
    }
  };

  const auth = { logIn, logOut, getAuth, setLoading, key, loading };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };

function RouteProtect({ children }) {

  const { key, loading, getAuth, setLoading } = useContext(AuthContext);
  const navigate = useNavigate()

  useEffect(() => {
    getAuth();
  }, []);

  const session = JSON.parse(sessionStorage.getItem(key));
  const location = useLocation();
  const routeCurrent = location.pathname;

  const routes = [
    {
      rol: "admin",
      routes: [
        "/",
        "/admin",
        "/perfil",
        "/vigilancia",
        "/maniobras",
        "/reparaciones",
        "/prelavado",
        "/calidad",
        "/lavado",
        "/create_maniobra",
        "/maniobras/pendiente"
      ],
    },
    {
      rol: "developer",
      routes: [
        "/",
        "/admin",
        "/perfil",
        "/vigilancia",
        "/maniobras",
        "/reparaciones",
        "/prelavado",
        "/calidad",
        "/lavado",
        "/create_maniobra",
        "/maniobras/pendiente"

      ],
    },
    {
      rol: "vigilante",
      routes: ["/", "/vigilancia", "/perfil"],
    },
  ];

  function asignedModules(routes, userRol, pathname) {
    const licenses = routes.find((route) => route.rol === userRol);

    const routesAprove = licenses?.routes;

    if (routesAprove.includes(pathname)) {
      return children;
    } else {
      return <Navigate to={routesAprove[1]} />;
    }
  }

  if (loading) {
    return (
      <Container
        maxWidth="xxs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "whitesmoke",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if(!session){
    navigate("/")
  }

  if (!loading) {
    return asignedModules(routes, session.user_metadata.rol, routeCurrent);
  }
}

export { RouteProtect };
