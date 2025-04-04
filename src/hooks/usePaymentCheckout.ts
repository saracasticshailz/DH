'use client';

import { useState, useCallback, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface CheckoutData {
  merchant_key: string;
  success_url: string;
  cancel_url: string;
  operation: string;
  hash: string;
  order: {
    number: string;
    amount: string;
    currency: string;
    description: string;
  };
}

interface PaymentCallbackParams {
  payment_id: string | null;
  trans_id: string | null;
  order_id: string | null;
  hash: string | null;
  amount?: string | null;
  currency?: string | null;
  description?: string | null;
  [key: string]: string | null | undefined;
}

interface UsePaymentCheckoutProps {
  merchantKey: string;
  successUrl: string;
  cancelUrl: string;
  hashSecret: string;
  apiUrl: string;
  onSuccess?: (params: PaymentCallbackParams) => void;
  onFailure?: (error: string, params?: PaymentCallbackParams) => void;
}

interface UsePaymentCheckoutReturn {
  initiateCheckout: (orderNumber: string, amount: string, currency: string, description: string) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  paymentData: PaymentCallbackParams | null;
  isCallbackProcessing: boolean;
  isValidCallback: boolean | null;
  validatePaymentOutputHash: (params: PaymentCallbackParams) => boolean;
  getQueryParams: (url: string) => PaymentCallbackParams;
}

export const usePaymentCheckout = (): UsePaymentCheckoutReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentCallbackParams | null>(null);
  const [isCallbackProcessing, setIsCallbackProcessing] = useState<boolean>(false);
  const [isValidCallback, setIsValidCallback] = useState<boolean | null>(null);

  //TODO : Add to ENV later
  const SUCCESS_URL = 'http://localhost:3000/PaymentLanding';
  const FAILURE_URL = 'http://localhost:3000/PaymentLanding';
  const HASH_SECRET = 'aa81310cb6a27b222d13658927d1a31e';
  const apiUrl = 'http://localhost:3005/paymentService/initiate-checkout';
  //'http://localhost:3001/initiate-checkout';
  const merchantKey = 'c61ff088-fd93-11ef-9640-3210e0c8f150';

  const validatePaymentOutputHash = (params: any): boolean => {
    if (!params.payment_id || !params.order_id || !params.hash) {
      return false;
    }

    const paymentId = params.payment_id;
    const referenceNumber = params.order_id;
    const feeAmount = params.amount || '';
    const currency = params.currency || 'AED';
    const description = params.description || 'MORTAGE VALUATION FEE';
    const paymenthash = params.hash;

    const stringToHash = paymentId + referenceNumber + feeAmount + currency + description + HASH_SECRET;

    const md5Encoded = CryptoJS.MD5(stringToHash.toUpperCase()).toString(CryptoJS.enc.Hex);
    const sha1Hash = CryptoJS.SHA1(md5Encoded);
    const result = CryptoJS.enc.Hex.stringify(sha1Hash);

    // console.log('generated HASH ', result);
    return result === paymenthash;
  };

  const initiateCheckout = async (
    orderReferenceNumber: string,
    feeAmount: string,
    currency: string,
    description: string
  ): Promise<void> => {
    // console.log('orderReferenceNumber', orderReferenceNumber);
    // console.log('feeAmount', feeAmount);
    // console.log('currency', currency);
    // console.log('description', description);

    const PAYMENT_GATEWAY_URL = apiUrl;
    setIsProcessing(true);
    setError(null);

    try {
      // const hash = generateHash(orderReferenceNumber, `${feeAmount}${currency}${description}`, HASH_SECRET);
      const hash = generateHash('BYUT34343', '2000.00AEDVALUATIONTESTFEE', 'aa81310cb6a27b222d13658927d1a31e');

      const checkoutData = {
        merchant_key: merchantKey,
        success_url: SUCCESS_URL,
        cancel_url: FAILURE_URL,
        operation: 'purchase',
        hash: hash,
        order: {
          // number: orderReferenceNumber,
          // amount: feeAmount,
          // currency: currency,
          // description: description,
          // TODO :  This is hardcoded for now as we get 500
          number: 'BYUT34343', // Order number
          amount: '2000.00', // Order amount
          currency: 'AED', // Currency type
          description: 'VALUATIONTESTFEE',
        },
      };

      // Send the POST request to the backend
      const response = await fetch(PAYMENT_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();

        // If the payment URL is returned from the server, redirect the client to it
        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          const errorMsg = data.error_message || 'Failed to retrieve payment URL';
          setError(errorMsg);
          console.error('Failed to retrieve payment URL:', errorMsg);
        }
      } else {
        const data = await response.json();
        const errorMsg = data.error_message || 'Payment initiation failed';
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateHash = (referenceNumber: string, feeAmount: string, password: string): string => {
    const stringToHash = referenceNumber + feeAmount + password;

    const md5Encoded = CryptoJS.MD5(stringToHash.toUpperCase()).toString(CryptoJS.enc.Hex);
    const sha1Hash = CryptoJS.SHA1(md5Encoded);
    const result = CryptoJS.enc.Hex.stringify(sha1Hash);

    return result;
  };

  const getQueryParams = useCallback((url: string): PaymentCallbackParams => {
    try {
      const urlObj = new URL(url);
      const params: PaymentCallbackParams = {
        payment_id: null,
        trans_id: null,
        order_id: null,
        hash: null,
      };

      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return params;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return {
        payment_id: null,
        trans_id: null,
        order_id: null,
        hash: null,
      };
    }
  }, []);

  // Process callback when component mounts or URL changes
  useEffect(() => {
    const processCallback = () => {
      // Only process if we're on the success URL path
      if (!window.location.href.includes(SUCCESS_URL)) {
        return;
      }

      setIsCallbackProcessing(true);

      try {
        // Extract parameters from URL
        const params = getQueryParams(window.location.href);
        setPaymentData(params);

        // Verify hash
        const isValid = validatePaymentOutputHash(params);
        setIsValidCallback(isValid);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error processing payment callback';
        setError(errorMessage);
      } finally {
        setIsCallbackProcessing(false);
      }
    };

    processCallback();
  }, [SUCCESS_URL, getQueryParams]);

  return {
    initiateCheckout,
    isProcessing,
    error,
    paymentData,
    isCallbackProcessing,
    isValidCallback,
    validatePaymentOutputHash,
    getQueryParams,
  };
};
