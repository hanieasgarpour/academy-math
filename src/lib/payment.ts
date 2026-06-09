// Abstract interface for payment gateway
export interface PaymentGatewayInterface {
  createPayment(
    amount: number,
    description: string,
    callbackUrl: string
  ): Promise<{ authority: string; paymentUrl: string }>;
  verifyPayment(
    authority: string,
    amount: number
  ): Promise<{ success: boolean; refId?: string; cardPan?: string }>;
}

// Mock Zarinpal implementation
export class MockZarinpalGateway implements PaymentGatewayInterface {
  async createPayment(
    amount: number,
    description: string,
    callbackUrl: string
  ) {
    const authority = `MOCK_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const paymentUrl = `${callbackUrl}?Authority=${authority}&Status=OK`;
    return { authority, paymentUrl };
  }

  async verifyPayment(authority: string, _amount: number) {
    // Mock: always succeed if authority starts with MOCK_
    if (authority.startsWith("MOCK_")) {
      return {
        success: true,
        refId: `REF_${Date.now()}`,
        cardPan: "123456****1234",
      };
    }
    return { success: false };
  }
}

// Factory function - swap this to use real Zarinpal later
export function getPaymentGateway(): PaymentGatewayInterface {
  return new MockZarinpalGateway();
}

// Convert Rials to Toman for display
export function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

// Convert Toman to Rials for payment
export function toRials(toman: number): number {
  return toman * 10;
}
