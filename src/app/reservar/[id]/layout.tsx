import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // La verificación de sesión y rol de administrador la gestiona el middleware.ts globalmente.
  // Aquí proporcionamos el contenedor visual para la zona de administración.
  return <div className="bg-[var(--color-background-primary)] min-h-screen">{children}</div>;
}