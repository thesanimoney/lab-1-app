interface User {
    faceId: string; // A unique identifier for a user's face data
    bankCard: {
      cardNumber: string;
      expirationDate: string;
      pinCode: number;
    };
  }
  
  export const storedUser: User = {
    faceId: "unique_face_identifier",
    bankCard: {
      cardNumber: "1234567890123456",
      expirationDate: "12/25",
      pinCode: 1234,
    },
  };
  