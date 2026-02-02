
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

export const submitPaymentReceipt = async ({
  orderId,
  amount,
  receiptImageUrl,
}) =>{
  try {
    if (!orderId) {
      throw new Error("orderId is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!receiptImageUrl) {
      throw new Error("Receipt image is required");
    }

    const res = await fetch("/api/payments/bank-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        method: "BANK_RECEIPT",
        amount,
        receiptImageUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create payment");
    }

    return {
      success: true,
      payment: data.payment,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}