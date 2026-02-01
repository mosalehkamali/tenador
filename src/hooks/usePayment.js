
const MOCK_ORDERS = {
  "ORD-12345": {
    trackingCode: "ORD-12345",
    items: [
      { id: "1", name: "دوره جامع طراحی وب", price: 4500000, quantity: 1 },
      { id: "2", name: "کتاب استراتژی محتوا", price: 250000, quantity: 2 }
    ],
    totalPrice: 5000000,
    paymentMethod: "BANK_RECEIPT",
    status: "PENDING",
    userEmail: "" 
  },
  "ORD-67890": {
    trackingCode: "ORD-67890",
    items: [
      { id: "3", name: "لپ‌تاپ گیمینگ ایسوس", price: 65000000, quantity: 1 }
    ],
    totalPrice: 65000000,
    paymentMethod: "INSTALLMENT",
    status: "PENDING",
    userEmail: "user@example.com",
    installmentPlan: {
      totalInstallments: 12,
      monthlyAmount: 6000000,
      prepayment: 5000000
    }
  },
  "ORD-ONLINE": {
    trackingCode: "ORD-ONLINE",
    items: [],
    totalPrice: 1000,
    paymentMethod: "ONLINE",
    status: "PENDING"
  }
};

export const fetchOrder = async (trackingCode) => {
  if (!trackingCode) {
    throw new Error("Tracking code is required");
  }

  const res = await fetch(`/api/orders/${trackingCode}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data.order;
}

export const updateProfileEmail = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Email updated to: ${email}`);
};

export const submitPaymentReceipt = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log("Payment receipt submitted", data);
  return true;
};
