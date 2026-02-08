# InstantPersonalize

**AI-Powered Website Personalization for SMBs**

## The Problem
30 million Shopify stores show the same website to every visitor, despite visitors arriving with different intents (gaming, professional work, budget shopping). Enterprise personalization tools cost $50,000-$200,000/year—completely inaccessible to small businesses.

## Our Solution
A plug-and-play JavaScript snippet that uses AI to detect visitor intent and personalizes the hero section in real-time. **One script tag. 60-second install. $29/month.**

##  Key Features

### 1. Multi-Signal Intent Detection
- URL query parameters
- UTM source/campaign
- Referrer type (YouTube, LinkedIn, Google)
- Device type
- Semantic analysis via Gemini AI embeddings

### 2. Advanced Decision Engine
- **Semantic Classification**: Gemini embeddings + cosine similarity
- **Bayesian Inference**: Fuses multiple signals with prior probabilities
- **Thompson Sampling**: Multi-armed bandit for template optimization
- **Explainable AI**: Every decision includes reasoning and confidence scores

### 3. Safe DOM Injection
- Non-destructive hero swapping
- Graceful fallback if elements missing
- Image preloading for smooth transitions
- Error handling with user-friendly messages

### 4. Real-Time Visualization
- Live decision pipeline animation
- Intent probability distribution
- Execution timing breakdown
- Full decision JSON export

## Demo Instructions

### Quick Test (30 seconds)
1. Open `index.html` in browser
2. Click demo buttons at top:
   - ** Gaming Visitor** → See gaming-focused hero
   - ** Professional Visitor** → See productivity-focused hero
   - ** Budget Visitor** → See price-focused hero
3. Watch decision panel animate on right side
4. Click "View Full Decision JSON" to see technical details

### Advanced Testing (URL Parameters)

Gaming: /?intent=gaming 
Professional: /?q=monitor+for+work 
Budget: /?q=cheap+monitor&utm_source=facebook 
LinkedIn: /?utm_source=linkedin 
YouTube: /?utm_source=youtube

## 📊 Technical Architecture
User Arrives ↓ Context Collection (15ms) ↓ Semantic Intent Classification via Gemini (180ms) ↓ Bayesian Signal Fusion (20ms) ↓ Thompson Sampling Template Selection (30ms) ↓ DOM Injection + Animation (50ms) ↓ Total: ~295ms (feels instant)


## 🎓 Technical Depth

### Machine Learning
- **Embeddings**: Gemini `text-embedding-001` model
- **Similarity**: Cosine similarity for semantic matching
- **Bayesian**: Prior/posterior probability updates
- **Bandits**: Beta distribution sampling for exploration/exploitation

### Frontend Engineering
- Pure vanilla JavaScript (no frameworks for speed)
- Async/await for non-blocking operations
- RAF-optimized animations
- Error boundaries and fallback logic
- Image preloading for UX

## 💰 Business Model

- **Target Market**: 30M Shopify stores + 100M SMB websites
- **Pricing**: $29/month (vs $50K/year enterprise)
- **TAM**: $10B+ addressable market
- **Moat**: Explainability, speed, SMB-first approach

## 📁 Project Structure

├── index.html # Demo storefront ├── instant-personalize.js # Main engine (all the AI logic) ├── template-registry.json # Template definitions ├── intent-embeddings.json # Pre-computed embeddings ├── images/ │ ├── gaming.jpg │ ├── professional.jpg │ └── budget.jpg └── README.md

## 🏆 Why This Wins
1. **Solves Real Problem**: 30M underserved SMBs
2. **Technical Sophistication**: Embeddings + Bayesian + Thompson Sampling
3. **Production-Ready**: Error handling, fallbacks, performance optimized
4. **Explainable AI**: Every decision is transparent and auditable
5. **Clear Business Model**: $29/month × 30M stores = $10B opportunity
## 🔧 Installation (For Real Websites)
```html
<script src="https://cdn.instantpersonalize.com/v1/script.js"></script>
<script>
  InstantPersonalize.init({
    apiKey: 'YOUR_KEY',
    templates: ['gaming', 'professional', 'budget']
  });
</script>