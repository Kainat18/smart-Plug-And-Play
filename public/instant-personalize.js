// ============================================
// INSTANT PERSONALIZE - COMPLETE ENGINE
// ============================================

// ============================================
// UTILITY FUNCTIONS
// ============================================

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
}

function softmax(values) {
  const maxVal = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - maxVal));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sumExps);
}

// ============================================
// CONTEXT COLLECTOR
// ============================================

class ContextCollector {
  collect() {
    const t0 = performance.now();

    const urlParams = new URLSearchParams(window.location.search);

    const context = {
      url: window.location.href,
      query: urlParams.get("q") || "",
      intent: urlParams.get("intent") || null,
      utm_source: urlParams.get("utm_source") || null,
      utm_campaign: urlParams.get("utm_campaign") || null,
      utm_medium: urlParams.get("utm_medium") || null,
      referrer: document.referrer || "direct",
      referrer_type: this.classifyReferrer(document.referrer),
      device: this.detectDevice(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    };

    const t1 = performance.now();
    context.execution_time_ms = parseFloat((t1 - t0).toFixed(2));

    return context;
  }

  classifyReferrer(referrer) {
    if (!referrer || referrer === "") return "direct";
    if (referrer.includes("google")) return "search_google";
    if (referrer.includes("youtube")) return "social_video";
    if (referrer.includes("facebook") || referrer.includes("instagram"))
      return "social_meta";
    if (referrer.includes("linkedin")) return "social_professional";
    if (referrer.includes("twitter") || referrer.includes("x.com"))
      return "social_twitter";
    return "referral";
  }

  detectDevice() {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }
}

// ============================================
// SEMANTIC INTENT CLASSIFIER (GEMINI)
// ============================================

class SemanticIntentClassifier {
  constructor(apiKey, intentEmbeddings) {
    this.apiKey = apiKey;
    this.intentEmbeddings = intentEmbeddings;
  }

  async classifyIntent(context) {
    const t0 = performance.now();

    // If demo intent override, use it
    if (context.intent) {
      return {
        intent: context.intent.toUpperCase(),
        confidence: 1.0,
        method: "demo_override",
        reasoning: "Demo intent explicitly provided",
        probabilities: { [context.intent.toUpperCase()]: 1.0 },
        execution_time_ms: parseFloat((performance.now() - t0).toFixed(2)),
      };
    }

    const query = context.query.toLowerCase();

    // If no query, use referrer-based heuristics
    if (!query) {
      return this.classifyByReferrer(context, t0);
    }

    try {
      // Try Gemini with timeout
      const geminiPromise = this.getGeminiEmbedding(query);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API timeout")), 3000),
      );

      // Get embedding for user query using Gemini
      const queryEmbedding = await this.getGeminiEmbedding(query);

      // Calculate cosine similarity to each intent
      const similarities = {};
      for (const [intent, embedding] of Object.entries(this.intentEmbeddings)) {
        similarities[intent] = cosineSimilarity(queryEmbedding, embedding);
      }

      // Convert similarities to probabilities using softmax
      const simValues = Object.values(similarities);
      const probabilities = softmax(simValues);
      const intentProbs = {};
      Object.keys(similarities).forEach((intent, i) => {
        intentProbs[intent] = probabilities[i];
      });

      // Find top intent
      const topIntent = Object.entries(intentProbs).reduce((a, b) =>
        b[1] > a[1] ? b : a,
      )[0];

      const confidence = intentProbs[topIntent];

      const t1 = performance.now();

      return {
        intent: topIntent,
        confidence: parseFloat(confidence.toFixed(3)),
        method: "semantic_embeddings",
        reasoning: `Semantic analysis of query "${query}" matched ${topIntent} intent`,
        probabilities: intentProbs,
        similarities: similarities,
        execution_time_ms: parseFloat((t1 - t0).toFixed(2)),
      };
    } catch (error) {
      console.warn(
        "⚠️ Gemini API failed, using rule-based fallback:",
        error.message,
      );

      const fallbackResult = this.classifyByRules(context, t0);
      fallbackResult.fallback_reason = error.message;
      fallbackResult.warning =
        "Using rule-based classification due to API failure";

      return fallbackResult;
    }
  }

  async getGeminiEmbedding(text) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: {
            parts: [{ text: text }],
          },
        }),
      },
    );

    const data = await response.json();
    return data.embedding.values;
  }

  classifyByRules(context, startTime) {
    const query = context.query.toLowerCase();

    const gamingKeywords = ["gaming", "game", "fps", "hz", "esports", "rgb"];
    const professionalKeywords = [
      "work",
      "office",
      "professional",
      "productivity",
      "design",
      "photo",
    ];
    const budgetKeywords = [
      "cheap",
      "budget",
      "affordable",
      "deal",
      "discount",
      "price",
    ];

    let intent = "DEFAULT";
    let confidence = 0.5;
    let reasoning = "No strong signals detected";

    for (const keyword of gamingKeywords) {
      if (query.includes(keyword)) {
        intent = "GAMING";
        confidence = 0.85;
        reasoning = `Keyword match: "${keyword}"`;
        break;
      }
    }

    if (intent === "DEFAULT") {
      for (const keyword of professionalKeywords) {
        if (query.includes(keyword)) {
          intent = "PROFESSIONAL";
          confidence = 0.82;
          reasoning = `Keyword match: "${keyword}"`;
          break;
        }
      }
    }

    if (intent === "DEFAULT") {
      for (const keyword of budgetKeywords) {
        if (query.includes(keyword)) {
          intent = "BUDGET";
          confidence = 0.8;
          reasoning = `Keyword match: "${keyword}"`;
          break;
        }
      }
    }

    return {
      intent,
      confidence,
      method: "rule_based",
      reasoning,
      probabilities: { [intent]: confidence },
      execution_time_ms: parseFloat((performance.now() - startTime).toFixed(2)),
    };
  }

  classifyByReferrer(context, startTime) {
    let intent = "DEFAULT";
    let confidence = 0.6;
    let reasoning = "Based on referrer type";

    if (context.referrer_type === "social_video") {
      intent = "GAMING";
      confidence = 0.7;
      reasoning = "YouTube referrer suggests entertainment/gaming intent";
    } else if (context.referrer_type === "social_professional") {
      intent = "PROFESSIONAL";
      confidence = 0.72;
      reasoning = "LinkedIn referrer suggests professional intent";
    }

    return {
      intent,
      confidence,
      method: "referrer_heuristic",
      reasoning,
      probabilities: { [intent]: confidence },
      execution_time_ms: parseFloat((performance.now() - startTime).toFixed(2)),
    };
  }
}

// ============================================
// BAYESIAN DECISION ENGINE
// ============================================

class BayesianDecisionEngine {
  constructor(priors) {
    this.priors = { ...priors };
  }

  updateBeliefs(semanticProbs, extraSignals) {
    let beliefs = { ...semanticProbs };
    let history = [];
    let prior = { ...beliefs };

    for (let signal of extraSignals) {
      let likelihoods = signal.likelihoods;
      let unnorm = {};
      let total = 0;
      for (let intent in beliefs) {
        unnorm[intent] = beliefs[intent] * (likelihoods[intent] ?? 1.0);
        total += unnorm[intent];
      }
      for (let intent in unnorm) {
        unnorm[intent] = unnorm[intent] / (total || 1);
      }
      history.push({
        signal: signal.name,
        prior: { ...prior },
        likelihood: { ...likelihoods },
        posterior: { ...unnorm },
      });
      beliefs = { ...unnorm };
      prior = { ...beliefs };
    }

    return {
      final_beliefs: beliefs,
      update_history: history,
    };
  }
}

// ============================================
// THOMPSON SAMPLING OPTIMIZER
// ============================================

class ThompsonSamplingOptimizer {
  constructor(templates) {
    this.templates = templates;
  }

  selectBest(intent) {
    const template = this.templates[intent];
    if (!template) return null;

    const s = Math.max(1, template.successes ?? 1);
    const f = Math.max(1, template.failures ?? 1);
    const mean = s / (s + f);
    const variance = (s * f) / ((s + f) ** 2 * (s + f + 1));

    return {
      chosen_template: template.template_id,
      intent: intent,
      statistics: {
        successes: s,
        failures: f,
        estimated_cvr: mean,
        confidence_interval: [
          Math.max(0, mean - 1.96 * Math.sqrt(variance)),
          Math.min(1, mean + 1.96 * Math.sqrt(variance)),
        ],
      },
    };
  }
}

// ============================================
// DOM INJECTOR (WITH PROPER FALLBACK)
// ============================================

class DOMInjector {
  async swapHeroContent(template, fallbackTemplate = null) {
    const t0 = performance.now();

    try {
      // ✅ VERIFY ALL ELEMENTS EXIST FIRST
      const elements = {
        img: document.getElementById("hero-image"),
        headline: document.getElementById("hero-headline"),
        subheadline: document.getElementById("hero-subheadline"),
        cta: document.getElementById("hero-cta"),
        badges: document.getElementById("hero-badges"),
      };

      const missingElements = [];
      if (!elements.img) missingElements.push("hero-image");
      if (!elements.headline) missingElements.push("hero-headline");
      if (!elements.subheadline) missingElements.push("hero-subheadline");
      if (!elements.cta) missingElements.push("hero-cta");

      if (missingElements.length > 0) {
        throw new Error(
          `Missing required elements: ${missingElements.join(", ")}`,
        );
      }

      // ✅ ADD LOADING STATE
      const heroContainer = document.getElementById("hero-container");
      if (heroContainer) {
        heroContainer.classList.add("hero-transforming");
      }

      // Fade out
      elements.img.style.opacity = "0.3";
      elements.headline.style.opacity = "0.2";
      elements.subheadline.style.opacity = "0.2";
      elements.cta.style.opacity = "0.2";
      if (elements.badges) elements.badges.style.opacity = "0";

      await new Promise((r) => setTimeout(r, 200));

      // ✅ VALIDATE IMAGE PATH
      if (!template.hero_image) {
        throw new Error("Template missing hero_image path");
      }

      // ✅ TRY TO LOAD IMAGE WITH FALLBACK
      const imageLoaded = await this.loadImageWithFallback(
        elements.img,
        template.hero_image,
        fallbackTemplate ? fallbackTemplate.hero_image : null,
      );

      if (!imageLoaded && fallbackTemplate) {
        // Use fallback template content
        console.warn("⚠️ Using fallback template due to image load failure");
        template = fallbackTemplate;
      }

      // Swap text
      elements.headline.textContent = template.headline || "Premium Displays";
      elements.subheadline.textContent =
        template.subheadline || "Find your perfect monitor";
      elements.cta.textContent = template.cta_text || "Shop Now";
      elements.cta.href = template.cta_link || "#products";

      // Swap badges
      if (elements.badges) {
        elements.badges.innerHTML = "";
        for (let badge of template.badges || []) {
          const badgeEl = document.createElement("span");
          badgeEl.className =
            "bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm";
          badgeEl.textContent = badge;
          elements.badges.appendChild(badgeEl);
        }
      }

      // Fade in
      elements.img.style.opacity = "1";
      elements.headline.style.opacity = "1";
      elements.subheadline.style.opacity = "1";
      elements.cta.style.opacity = "1";
      if (elements.badges) elements.badges.style.opacity = "1";

      // REMOVE LOADING STATE
      if (heroContainer) {
        heroContainer.classList.remove("hero-transforming");
      }

      const t1 = performance.now();
      return {
        success: true,
        timing: +(t1 - t0).toFixed(1),
        template_applied: template.template_id,
        fallback_used: !imageLoaded && fallbackTemplate !== null,
      };
    } catch (e) {
      console.error("❌ [DOM Injection Failed]", e);

      // SHOW USER-FRIENDLY ERROR
      const errorPanel = document.getElementById("error-message");
      if (errorPanel) {
        errorPanel.textContent =
          "Personalization unavailable - showing default";
        errorPanel.classList.remove("hidden");
        setTimeout(() => errorPanel.classList.add("hidden"), 3000);
      }

      return {
        success: false,
        error: e.message,
        fallback_applied: true,
      };
    }
  }

  /**
   * Try to load image, with fallback to alternative image
   * Returns true if successful, false if both failed
   */
  async loadImageWithFallback(imgElement, primarySrc, fallbackSrc = null) {
    return new Promise((resolve) => {
      // First, try to load the primary image
      const testPrimary = new Image();

      testPrimary.onload = () => {
        console.log(`✅ Image loaded: ${primarySrc}`);
        imgElement.src = primarySrc;
        resolve(true);
      };

      testPrimary.onerror = () => {
        console.error(`❌ Failed to load primary image: ${primarySrc}`);

        if (fallbackSrc) {
          console.log(`🔄 Attempting fallback image: ${fallbackSrc}`);

          // Try fallback image
          const testFallback = new Image();

          testFallback.onload = () => {
            console.log(`✅ Fallback image loaded: ${fallbackSrc}`);
            imgElement.src = fallbackSrc;
            resolve(true);
          };

          testFallback.onerror = () => {
            console.error(`❌ Fallback image also failed: ${fallbackSrc}`);
            // Keep current image, don't change it
            resolve(false);
          };

          testFallback.src = fallbackSrc;
        } else {
          // No fallback available, keep current image
          resolve(false);
        }
      };

      testPrimary.src = primarySrc;

      // Timeout after 3 seconds
      setTimeout(() => {
        console.warn(`⏱️ Image load timeout: ${primarySrc}`);
        resolve(false);
      }, 3000);
    });
  }
}

// ============================================
// DECISION VISUALIZER
// ============================================

class DecisionVisualizer {
  animate(decisionObj, timings) {
    const panel = document.getElementById("decision-panel");
    if (!panel) return;

    // Animate intent probability bars
    const intentBars = document.getElementById("intent-bars");
    if (intentBars && decisionObj.bayesian) {
      intentBars.innerHTML = "";
      const intents = decisionObj.bayesian.final_beliefs;
      for (let [intent, prob] of Object.entries(intents)) {
        const width = Math.round(100 * prob);
        const bar = document.createElement("div");
        bar.className = "my-2 flex items-center";
        bar.innerHTML = `
                    <span class="w-28 text-sm font-medium">${intent}</span>
                    <div class="h-4 bg-gray-200 flex-1 rounded relative mx-2">
                        <div class="bg-blue-600 h-4 rounded absolute left-0 top-0 transition-all duration-700"
                             style="width:0%"></div>
                    </div>
                    <span class="w-10 text-right text-sm">${width}%</span>
                `;
        intentBars.appendChild(bar);
        setTimeout(() => {
          bar.querySelector(".bg-blue-600").style.width = width + "%";
        }, 120);
      }
    }

    // Animate step status
    const steps = [
      { id: "step-context", time: timings.context || 0 },
      { id: "step-semantic", time: timings.semantic || 0 },
      { id: "step-bayesian", time: timings.bayesian || 0 },
      { id: "step-thompson", time: timings.thompson || 0 },
      { id: "step-dom", time: timings.dom || 0 },
    ];

    let delay = 0;
    steps.forEach((s) => {
      setTimeout(() => {
        const el = document.getElementById(s.id);
        if (el) {
          el.classList.remove("bg-gray-200");
          el.classList.add("bg-green-500");
        }
        const timeEl = document.getElementById(s.id + "-time");
        if (timeEl) timeEl.textContent = s.time + "ms";
      }, delay);
      delay += 150;
    });

    // JSON Modal
    const jsonBtn = document.getElementById("view-json-btn");
    const jsonModal = document.getElementById("json-modal");
    const jsonContent = document.getElementById("json-content");
    const closeJson = document.getElementById("json-close-btn");

    if (jsonBtn && jsonModal && jsonContent && closeJson) {
      jsonBtn.onclick = () => {
        jsonModal.classList.remove("hidden");
        jsonContent.textContent = JSON.stringify(decisionObj, null, 2);
      };
      closeJson.onclick = () => {
        jsonModal.classList.add("hidden");
      };
    }

    // Slide in panel
    setTimeout(() => panel.classList.remove("translate-x-full"), 500);
  }
}

// ============================================
// MAIN PERSONALIZATION ENGINE
// ============================================

class PersonalizationEngine {
  constructor(config) {
    this.config = config;
    this.templates = null;
    this.intentEmbeddings = null;
    this.ctxCollector = new ContextCollector();
    this.geminiKey = config.geminiKey;
  }

  async loadAssets() {
    try {
      const [templates, embeddings] = await Promise.all([
        fetch("/template-registry.json").then((res) => res.json()),
        fetch("/intent-embeddings.json").then((res) => res.json()),
      ]);
      this.templates = templates;
      this.intentEmbeddings = embeddings;
    } catch (error) {
      console.error("Asset loading error:", error);
      throw error;
    }
  }

  async run() {
    const timings = {};

    // 1. Context Collection
    const t0 = performance.now();
    const context = this.ctxCollector.collect();
    timings.context = +(performance.now() - t0).toFixed(2);

    // 2. Semantic Classification
    const t1 = performance.now();
    const classifier = new SemanticIntentClassifier(
      this.geminiKey,
      this.intentEmbeddings,
    );
    const semantic = await classifier.classifyIntent(context);
    timings.semantic = +(performance.now() - t1).toFixed(2);

    // 3. Bayesian Update
    const t2 = performance.now();
    const priors = this.templates.priors || {
      GAMING: 0.3,
      PROFESSIONAL: 0.4,
      BUDGET: 0.2,
      DEFAULT: 0.1,
    };
    const bayes = new BayesianDecisionEngine(priors);

    const extraSignals = [];
    if (context.referrer_type && context.referrer_type !== "direct") {
      extraSignals.push({
        name: "referrer",
        likelihoods: {
          GAMING: context.referrer_type === "social_video" ? 0.8 : 1.0,
          PROFESSIONAL:
            context.referrer_type === "social_professional" ? 0.8 : 1.0,
          BUDGET: 1.0,
          DEFAULT: 1.0,
        },
      });
    }

    const bayesian = bayes.updateBeliefs(semantic.probabilities, extraSignals);
    timings.bayesian = +(performance.now() - t2).toFixed(2);

    // 4. Thompson Sampling
    const t3 = performance.now();
    const topIntent = Object.entries(bayesian.final_beliefs).reduce((a, b) =>
      b[1] > a[1] ? b : a,
    )[0];

    const tsOpt = new ThompsonSamplingOptimizer(this.templates.templates);
    const best = tsOpt.selectBest(topIntent);
    timings.thompson = +(performance.now() - t3).toFixed(2);

    const selectedTemplate =
      this.templates.templates[topIntent] || this.templates.templates.DEFAULT;

    

    // 5. DOM Injection WITH FALLBACK
    const t4 = performance.now();
    const domInjector = new DOMInjector();

    // Pass DEFAULT template as fallback
    const fallbackTemplate = this.templates.templates.DEFAULT;
    const domStatus = await domInjector.swapHeroContent(
      selectedTemplate,
      fallbackTemplate,
    );

    timings.dom = +(performance.now() - t4).toFixed(2);

    // Create decision object
    const DECISION_OBJ = {
      timestamp: new Date().toISOString(),
      context,
      semantic,
      bayesian,
      thompson: best,
      selected_template: selectedTemplate,
      domStatus,
      timings,
      total_time_ms: Object.values(timings)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
      applied: domStatus.success,
    };

    // Visualize
    const visualizer = new DecisionVisualizer();
    visualizer.animate(DECISION_OBJ, timings);

    window.__DECISION_OBJ__ = DECISION_OBJ;
    console.log("✅ Personalization Complete:", DECISION_OBJ);
    return DECISION_OBJ;
  }
}

// ============================================
// IMAGE PRELOADER
// ============================================

class ImagePreloader {
    constructor(templates) {
        // Dynamically get image paths from template registry
        this.images = Object.values(templates.templates)
            .map(t => t.hero_image)
            .filter(img => img); // Remove any undefined
        
        this.loaded = false;
    }

    async preload() {
        console.log('🖼️ Preloading hero images...');
        const startTime = performance.now();
        
        try {
            await Promise.all(
                this.images.map(src => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            console.log(`✅ Loaded: ${src}`);
                            resolve();
                        };
                        img.onerror = () => {
                            console.warn(`⚠️ Failed to preload: ${src}`);
                            resolve(); // Don't fail entire preload
                        };
                        img.src = src;
                    });
                })
            );
            
            this.loaded = true;
            const loadTime = performance.now() - startTime;
            console.log(`✅ All images preloaded in ${loadTime.toFixed(2)}ms`);
            return true;
        } catch (error) {
            console.error('Image preload error:', error);
            return false;
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  const GEMINI_API_KEY = "AIzaSyCALI5-rPMlu3SEfF2yTL0c3vBj1lYJWUI";

 try {
        const engine = new PersonalizationEngine({ geminiKey: GEMINI_API_KEY });
        
        // Load assets first
        await engine.loadAssets();
        
        // Then create preloader with templates
        const preloader = new ImagePreloader(engine.templates);
        
        // Preload and run in parallel
        await Promise.all([
            preloader.preload(),
            engine.run()
        ]);
        
        window.personalizationEngine = engine;
    } catch (error) {
        console.error('Personalization Engine Error:', error);
    }
});

// Demo control functions
window.simulateIntent = (intent) => {
  const url = new URL(window.location);
  url.searchParams.set("intent", intent);
  window.location = url.toString();
};

window.resetDemo = () => {
  const url = new URL(window.location);
  url.searchParams.delete("intent");
  url.searchParams.delete("q");
  window.location = url.toString();
};
