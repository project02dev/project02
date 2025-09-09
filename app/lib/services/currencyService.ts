// Currency conversion service for USD to NGN exchange rates

interface ExchangeRateResponse {
  success: boolean;
  rates: {
    NGN: number;
  };
  base: string;
  date: string;
}

interface CachedRate {
  rate: number;
  timestamp: number;
  expiresAt: number;
}

class CurrencyService {
  private static instance: CurrencyService;
  private cachedRate: CachedRate | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly FALLBACK_RATE = 1650; // Fallback rate if API fails

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Get current USD to NGN exchange rate
   * Uses multiple APIs with fallback for reliability
   */
  async getUSDToNGNRate(): Promise<number> {
    // Check cache first
    if (this.cachedRate && Date.now() < this.cachedRate.expiresAt) {
      return this.cachedRate.rate;
    }

    try {
      // Try primary API (exchangerate-api.com - free tier)
      const rate = await this.fetchFromExchangeRateAPI();
      if (rate) {
        this.cacheRate(rate);
        return rate;
      }

      // Try secondary API (fixer.io backup)
      const backupRate = await this.fetchFromFixerAPI();
      if (backupRate) {
        this.cacheRate(backupRate);
        return backupRate;
      }

      // Try third API (currencyapi.com)
      const thirdRate = await this.fetchFromCurrencyAPI();
      if (thirdRate) {
        this.cacheRate(thirdRate);
        return thirdRate;
      }

      // If all APIs fail, use cached rate if available
      if (this.cachedRate) {
        console.warn('Using cached exchange rate due to API failures');
        return this.cachedRate.rate;
      }

      // Final fallback
      console.warn('Using fallback exchange rate due to API failures');
      return this.FALLBACK_RATE;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return this.cachedRate?.rate || this.FALLBACK_RATE;
    }
  }

  /**
   * Convert USD amount to NGN
   */
  async convertUSDToNGN(usdAmount: number): Promise<{
    ngnAmount: number;
    exchangeRate: number;
    convertedAt: string;
  }> {
    const rate = await this.getUSDToNGNRate();
    const ngnAmount = Math.round(usdAmount * rate);
    
    return {
      ngnAmount,
      exchangeRate: rate,
      convertedAt: new Date().toISOString(),
    };
  }

  /**
   * Convert NGN amount back to USD (for display purposes)
   */
  async convertNGNToUSD(ngnAmount: number): Promise<{
    usdAmount: number;
    exchangeRate: number;
    convertedAt: string;
  }> {
    const rate = await this.getUSDToNGNRate();
    const usdAmount = Number((ngnAmount / rate).toFixed(2));
    
    return {
      usdAmount,
      exchangeRate: rate,
      convertedAt: new Date().toISOString(),
    };
  }

  /**
   * Get formatted currency display
   */
  formatCurrency(amount: number, currency: 'USD' | 'NGN'): string {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(amount);
    }
  }

  private async fetchFromExchangeRateAPI(): Promise<number | null> {
    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      
      if (!response.ok) return null;
      
      const data: ExchangeRateResponse = await response.json();
      return data.rates?.NGN || null;
    } catch (error) {
      console.error('ExchangeRate API error:', error);
      return null;
    }
  }

  private async fetchFromFixerAPI(): Promise<number | null> {
    try {
      // Note: Fixer.io requires API key for production
      // Using free tier endpoint for now
      const response = await fetch(
        'http://data.fixer.io/api/latest?access_key=YOUR_API_KEY&base=USD&symbols=NGN'
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.rates?.NGN || null;
    } catch (error) {
      console.error('Fixer API error:', error);
      return null;
    }
  }

  private async fetchFromCurrencyAPI(): Promise<number | null> {
    try {
      // Using currencyapi.com as third backup
      const response = await fetch(
        'https://api.currencyapi.com/v3/latest?apikey=YOUR_API_KEY&base_currency=USD&currencies=NGN'
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.data?.NGN?.value || null;
    } catch (error) {
      console.error('Currency API error:', error);
      return null;
    }
  }

  private cacheRate(rate: number): void {
    this.cachedRate = {
      rate,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION,
    };
  }

  /**
   * Get cached rate info for debugging
   */
  getCacheInfo(): CachedRate | null {
    return this.cachedRate;
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cachedRate = null;
  }
}

// Export singleton instance
export const currencyService = CurrencyService.getInstance();
export default currencyService;
