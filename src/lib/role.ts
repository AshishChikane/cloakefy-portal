/**
 * Get user role from localStorage jwt_token_data
 */
export function getUserRole(): 'entity' | 'subentity' | null {
  try {
    const jwtTokenData = localStorage.getItem('jwt_token_data');
    if (jwtTokenData) {
      const data = JSON.parse(jwtTokenData);
      return data.role || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Check if user has entity role
 */
export function isEntityUser(): boolean {
  return getUserRole() === 'entity';
}

/**
 * Check if user has subentity role
 */
export function isSubEntityUser(): boolean {
  return getUserRole() === 'subentity';
}

