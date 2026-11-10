import { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";

export default function HomeScreen() {
  // Datos provisionales del pedido
  const pedido = {
    folio: "1025",
    cliente: "Juan Pérez",
    direccion: "Av. Independencia #245",
    estado: "En camino",
  };

  // Coordenadas provisionales del domicilio
  const domicilio = {
    latitud: 25.774927,
    longitud: -108.998592,
  };

  // Radio permitido para entregar
  const RADIO_ENTREGA = 75;

  // Calcular distancia entre dos coordenadas GPS
  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const radioTierra = 6371000;

    const radianes = (grados: number) => (grados * Math.PI) / 180;

    const diferenciaLatitud = radianes(lat2 - lat1);
    const diferenciaLongitud = radianes(lon2 - lon1);

    const a =
      Math.sin(diferenciaLatitud / 2) ** 2 +
      Math.cos(radianes(lat1)) *
        Math.cos(radianes(lat2)) *
        Math.sin(diferenciaLongitud / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radioTierra * c;
  };

  // Estados para almacenar la ubicación y los permisos
  const [ubicacion, setUbicacion] = useState<Location.LocationObject | null>(
    null,
  );

  const [mensaje, setMensaje] = useState("Ubicación pendiente");

  const [cargando, setCargando] = useState(false);

  // Información del registro de entrega
  const [entrega, setEntrega] = useState<{
    fecha: string;
    latitud: number;
    longitud: number;
  } | null>(null);

  // Historial de pedidos entregados
  const [historialEntregas, setHistorialEntregas] = useState<
    {
      folio: string;
      cliente: string;
      repartidor: string;
      fecha: string;
      latitud: number;
      longitud: number;
    }[]
  >([]);

  // Seguimiento automático de la ubicación
  useEffect(() => {
    let suscripcion: Location.LocationSubscription | null = null;

    const iniciarSeguimiento = async () => {
      try {
        // Solicitar permiso de ubicación
        const permiso = await Location.requestForegroundPermissionsAsync();

        if (permiso.status !== "granted") {
          setMensaje("Permiso de ubicación denegado");
          return;
        }

        // Comenzar a observar los cambios de ubicación
        suscripcion = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
            timeInterval: 3000,
          },
          (posicion) => {
            setUbicacion(posicion);
            setMensaje("Ubicación actualizada automáticamente");
          },
        );
      } catch (error) {
        console.error(error);
        setMensaje("No se pudo iniciar el seguimiento GPS");
      }
    };

    iniciarSeguimiento();

    // Detener el seguimiento al salir de la pantalla
    return () => {
      suscripcion?.remove();
    };
  }, []);

  const distancia = ubicacion
    ? calcularDistancia(
        ubicacion.coords.latitude,
        ubicacion.coords.longitude,
        domicilio.latitud,
        domicilio.longitud,
      )
    : null;

  // Precisión máxima permitida del GPS
  const PRECISION_MAXIMA = 30;

  const precisionAceptable =
    ubicacion !== null &&
    ubicacion.coords.accuracy !== null &&
    ubicacion.coords.accuracy <= PRECISION_MAXIMA;

  // Validar distancia y precisión GPS
  const dentroDelRango =
    distancia !== null && distancia <= RADIO_ENTREGA && precisionAceptable;

  // Obtener ubicación GPS
  const obtenerUbicacion = async () => {
    try {
      setCargando(true);
      setMensaje("Solicitando ubicación...");

      // Solicitar permiso al usuario
      const permiso = await Location.requestForegroundPermissionsAsync();

      if (permiso.status !== "granted") {
        setMensaje("Permiso de ubicación denegado");
        setUbicacion(null);
        return;
      }

      // Obtener coordenadas actuales
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUbicacion(posicion);
      setMensaje("Ubicación obtenida correctamente");
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo obtener la ubicación");
    } finally {
      setCargando(false);
    }
  };

  // Registrar entrega del pedido
  const entregarPedido = () => {
    if (!ubicacion || !dentroDelRango || entrega !== null) {
      return;
    }

    const nuevaEntrega = {
      fecha: new Date().toISOString(),
      latitud: ubicacion.coords.latitude,
      longitud: ubicacion.coords.longitude,
    };

    // Guardar la entrega actual
    setEntrega(nuevaEntrega);

    // Agregar el pedido al historial
    setHistorialEntregas((historialAnterior) => [
      ...historialAnterior,
      {
        folio: pedido.folio,
        cliente: pedido.cliente,
        repartidor: "Repartidor de prueba",
        ...nuevaEntrega,
      },
    ]);

    setMensaje("¡Pedido entregado correctamente!");
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>App de repartidor</Text>

      <View style={styles.card}>
        <Text style={styles.etiqueta}>PEDIDO ASIGNADO</Text>

        <Text style={styles.folio}>#{pedido.folio}</Text>

        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.valor}>{pedido.cliente}</Text>

        <Text style={styles.label}>Dirección de entrega</Text>
        <Text style={styles.valor}>{pedido.direccion}</Text>

        <Text style={styles.label}>Estado</Text>
        <Text style={styles.estado}>{pedido.estado}</Text>

        <View style={styles.divisor} />

        <Text style={styles.seccion}>Ubicación del repartidor</Text>

        <Text style={styles.aviso}>{mensaje}</Text>

        {ubicacion && (
          <View style={styles.coordenadas}>
            <Text style={styles.label}>Latitud</Text>
            <Text style={styles.valor}>
              {ubicacion.coords.latitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>Longitud</Text>
            <Text style={styles.valor}>
              {ubicacion.coords.longitude.toFixed(6)}
            </Text>

            <Text style={styles.label}>Precisión GPS</Text>
            <Text style={styles.valor}>
              {Math.round(ubicacion.coords.accuracy ?? 0)} metros
            </Text>
          </View>
        )}

        <View style={styles.divisor} />

        <Text style={styles.seccion}>Distancia al domicilio</Text>

        <Text style={styles.metros}>
          {distancia !== null
            ? `${Math.round(distancia)} metros`
            : "Esperando ubicación"}
        </Text>

        <Text style={styles.aviso}>
          {distancia === null
            ? "Esperando ubicación GPS..."
            : !precisionAceptable
              ? "La precisión GPS es insuficiente. Espera una mejor señal."
              : distancia > RADIO_ENTREGA
                ? "Debes acercarte al domicilio."
                : "Estás dentro del rango. Puedes entregar el pedido."}
        </Text>

        <TouchableOpacity
          style={[
            styles.boton,
            (!dentroDelRango || entrega !== null) && styles.botonDeshabilitado,
          ]}
          disabled={!dentroDelRango || entrega !== null}
          onPress={entregarPedido}
        >
          <Text style={styles.textoBoton}>
            {entrega !== null ? "Pedido entregado" : "Entregar pedido"}
          </Text>
        </TouchableOpacity>

        {entrega !== null && (
          <View style={styles.coordenadas}>
            <Text style={styles.seccion}>Entrega registrada</Text>

            <Text style={styles.label}>Fecha y hora</Text>
            <Text style={styles.valor}>
              {new Date(entrega.fecha).toLocaleString("es-MX")}
            </Text>

            <Text style={styles.label}>Latitud</Text>
            <Text style={styles.valor}>{entrega.latitud.toFixed(6)}</Text>

            <Text style={styles.label}>Longitud</Text>
            <Text style={styles.valor}>{entrega.longitud.toFixed(6)}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDeshabilitado]}
          onPress={obtenerUbicacion}
          disabled={cargando}
        >
          <Text style={styles.textoBoton}>
            {cargando ? "Obteniendo ubicación..." : "Obtener mi ubicación"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Historial de entregas */}
      <View style={[styles.card, { marginTop: 20 }]}>
        <Text style={styles.seccion}>Historial de entregas</Text>

        {historialEntregas.length === 0 ? (
          <Text style={styles.aviso}>Todavía no hay pedidos entregados.</Text>
        ) : (
          historialEntregas.map((item, index) => (
            <View
              key={`${item.folio}-${index}`}
              style={{
                marginTop: 15,
                padding: 15,
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
              }}
            >
              <Text style={styles.folio}>Pedido #{item.folio}</Text>

              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.valor}>{item.cliente}</Text>

              <Text style={styles.label}>Repartidor</Text>
              <Text style={styles.valor}>{item.repartidor}</Text>

              <Text style={styles.label}>Fecha de entrega</Text>
              <Text style={styles.valor}>
                {new Date(item.fecha).toLocaleString("es-MX")}
              </Text>

              <Text style={styles.label}>Coordenadas</Text>
              <Text style={styles.valor}>
                {item.latitud.toFixed(6)}, {item.longitud.toFixed(6)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
    paddingTop: 70,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 16,
  },

  etiqueta: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "bold",
  },

  folio: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 25,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 15,
  },

  valor: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginTop: 5,
  },

  estado: {
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 5,
  },

  divisor: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 25,
  },

  seccion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  aviso: {
    marginTop: 12,
    color: "#2563EB",
    fontSize: 14,
  },

  coordenadas: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
  },

  boton: {
    backgroundColor: "#2563EB",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },

  botonDeshabilitado: {
    backgroundColor: "#9CA3AF",
  },

  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  metros: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
});
