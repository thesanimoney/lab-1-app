'use server'

import { storedUser } from "../../data/data";

// Function to validate card details
export async function validateCardDetails(inputCardNumber: string, inputPinCode: number) {
    // Compare input with stored data
    return (
      inputCardNumber === storedUser.bankCard.cardNumber &&
      inputPinCode === storedUser.bankCard.pinCode
    );
  }