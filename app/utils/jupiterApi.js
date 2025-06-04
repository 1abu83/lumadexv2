/**
 * Jupiter API integration for token swaps on Solana
 */

// Base URL for Jupiter API
const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

/**
 * Get a quote for swapping tokens
 * @param {string} inputMint - The mint address of the input token
 * @param {string} outputMint - The mint address of the output token
 * @param {number} amount - The amount to swap in input token's smallest unit
 * @param {number} slippageBps - Slippage tolerance in basis points (e.g., 50 = 0.5%)
 * @returns {Promise<Object>} - Quote response from Jupiter API
 */
export async function getQuote(inputMint, outputMint, amount, slippageBps = 50) {
  try {
    const url = `${JUPITER_API_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quote from Jupiter:', error);
    throw error;
  }
}

/**
 * Get a swap transaction
 * @param {Object} quoteResponse - The quote response from getQuote
 * @param {string} userPublicKey - The user's public key
 * @returns {Promise<Object>} - Swap transaction data
 */
export async function getSwapTransaction(quoteResponse, userPublicKey) {
  try {
    const url = `${JUPITER_API_BASE}/swap`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting swap transaction from Jupiter:', error);
    throw error;
  }
}

/**
 * Get list of tokens from Jupiter
 * @returns {Promise<Array>} - List of tokens
 */
export async function getTokensList() {
  try {
    const response = await fetch('https://token.jup.ag/all');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tokens list from Jupiter:', error);
    throw error;
  }
}