/**
 * Decode JWT token payload without verification
 * Note: This only decodes the payload, it does not verify the signature
 * For production, signature verification should be done on the backend
 */
export function decodeJWT(token: string): any {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid token format - expected JWT format');
    }

    // Decode the payload (second part) - JWT uses base64url encoding
    // Replace URL-safe characters: - becomes +, _ becomes /
    const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4);
    
    // Decode base64 to JSON
    const decodedPayload = atob(paddedPayload);
    const payload = JSON.parse(decodedPayload);
    
    return payload;
  } catch (error: any) {
    throw new Error(`Failed to decode JWT token: ${error.message}`);
  }
}

/**
 * Extract user data from JWT token payload
 */
export interface DecodedTokenData {
  id: number | string;
  email: string;
  google_id?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function extractTokenData(token: string): DecodedTokenData {
  const payload = decodeJWT(token);
  
  return {
    id: payload.id,
    email: payload.email,
    google_id: payload.google_id,
    role: payload.role,
    exp: payload.exp, // Expiration timestamp
    iat: payload.iat, // Issued at timestamp
  };
}

