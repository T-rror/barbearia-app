const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

export async function createPayment(data, token) {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(Array.isArray(err.message) ? err.message.join("; ") : err.message || "Erro ao criar pagamento");
  }

  return res.json();
}

export async function confirmPayment(paymentId, token) {
  const res = await fetch(`${API_URL}/payments/${paymentId}/confirm`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(Array.isArray(err.message) ? err.message.join("; ") : err.message || "Erro ao confirmar pagamento");
  }

  return res.json();
}

export async function getPaymentsByAppointment(appointmentId, token) {
  const res = await fetch(
    `${API_URL}/payments/appointment/${appointmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Erro ao buscar pagamentos");

  return res.json();
}

export async function fetchAllPayments() {
  const res = await fetch(`${API_URL}/payments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(Array.isArray(err.message) ? err.message.join("; ") : err.message || "Erro ao buscar pagamentos");
  }

  return res.json();
}
