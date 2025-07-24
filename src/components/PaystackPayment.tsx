import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaystackPaymentProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  metadata?: Record<string, any>;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  amount,
  email,
  onSuccess,
  onClose,
  metadata = {},
  disabled = false,
  className = "",
  children
}) => {
  const { toast } = useToast();

  const initializePayment = () => {
    if (!window.PaystackPop) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Paystack library not loaded. Please refresh the page."
      });
      return;
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key_here',
      email: email,
      amount: amount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Platform",
            variable_name: "platform",
            value: "PROJECT02"
          }
        ]
      },
      callback: function(response: any) {
        toast({
          title: "Payment Successful!",
          description: `Transaction reference: ${response.reference}`
        });
        onSuccess(response.reference);
      },
      onClose: function() {
        if (onClose) {
          onClose();
        }
      }
    });

    handler.openIframe();
  };

  return (
    <Button
      onClick={initializePayment}
      disabled={disabled}
      className={className}
    >
      {children || (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Pay ₦{amount.toLocaleString()}
        </>
      )}
    </Button>
  );
};