const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = Array.isArray(error.message) ? error.message.join("; ") : error.message;
    throw new Error(message || "Não foi possível acessar o financeiro.");
  }

  return response.json();
}

export function fetchExpenses(month) {
  return request(`/finance/expenses?month=${encodeURIComponent(month)}`);
}

export function createExpense(data) {
  return request("/finance/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
