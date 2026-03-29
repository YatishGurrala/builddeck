import { SocialProvider, PublishResult } from "../types";

/**
 * Mock X (Twitter) Provider
 * 
 * This is a mock implementation for development/testing.
 * Replace with real Twitter API v2 implementation for production.
 * 
 * To implement real X publishing:
 * 1. Get API keys from https://developer.twitter.com/
 * 2. Install twitter-api-v2: npm install twitter-api-v2
 * 3. Implement the publish method with real API calls
 */
export class XProvider implements SocialProvider {
  platform = "X" as const;
  
  private mockDelay = 1000; // Simulate network delay
  
  isConfigured(): boolean {
    // In production, check for API credentials
    const hasCredentials = !!(
      process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_SECRET
    );
    
    // For development, allow mock mode
    return hasCredentials || process.env.SOCIAL_MOCK_MODE === "true";
  }
  
  getCharacterLimit(): number {
    return 280; // X character limit
  }
  
  async publish(content: string): Promise<PublishResult> {
    // Validate content length
    if (content.length > this.getCharacterLimit()) {
      return {
        success: false,
        error: `Content exceeds ${this.getCharacterLimit()} character limit`,
      };
    }
    
    // Check if configured
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "X provider is not configured",
      };
    }
    
    // In mock mode, simulate publishing
    if (process.env.SOCIAL_MOCK_MODE === "true") {
      return this.mockPublish(content);
    }
    
    // Real implementation would go here
    // Example with twitter-api-v2:
    // const client = new TwitterApi({
    //   appKey: process.env.X_API_KEY!,
    //   appSecret: process.env.X_API_SECRET!,
    //   accessToken: process.env.X_ACCESS_TOKEN!,
    //   accessSecret: process.env.X_ACCESS_SECRET!,
    // });
    // const tweet = await client.v2.tweet(content);
    // return { success: true, postId: tweet.data.id, url: `https://x.com/...` };
    
    return {
      success: false,
      error: "Real X API not implemented yet",
    };
  }
  
  private async mockPublish(content: string): Promise<PublishResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.mockDelay));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: "[MOCK] Random failure for testing",
      };
    }
    
    const mockPostId = `mock_x_${Date.now()}`;
    console.log(`[MOCK X] Published post: ${mockPostId}`);
    console.log(`[MOCK X] Content: ${content}`);
    
    return {
      success: true,
      postId: mockPostId,
      url: `https://x.com/builddeck/status/${mockPostId}`,
    };
  }
}
