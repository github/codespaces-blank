"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const dni = formData.get("dni") as string;
  const phone = formData.get("phone") as string;
  const gdpr = formData.get("gdpr");

  if (!gdpr) {
    return redirect("/registro?error=Debes aceptar la Política de Privacidad para continuar");
  }

  const supabase = createClient();

  // Mandamos los datos a la capa segura de Autenticación de Supabase.
  // Almacenamos DNI, Nombre y Teléfono en la "metadata" para que el Trigger de base de datos
  // los pesque y cree el perfil real.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        dni: dni,
        phone: phone,
      }
    }
  });

  if (error) {
    return redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/verificar-email");
}