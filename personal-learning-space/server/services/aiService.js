import dotenv from 'dotenv';
dotenv.config();

/**
 * Intelligent Contextual Mock Teacher Provider
 * Provides rich, domain-aware XR QA pedagogical responses when no external API key is configured.
 */
class ContextualMockProvider {
  async generateResponse({ prompt, context, history }) {
    const p = prompt.toLowerCase();
    const currentConcept = context?.currentConcept;
    const weakAreas = context?.weakAreas || [];
    const stats = context?.stats;

    // Simulate natural thinking delay (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Handle Quick Action: "What am I forgetting?" / Recall prompt
    if (p.includes('forgetting') || p.includes('recall') || p.includes('what should i review')) {
      const weakList = weakAreas.flatMap(g => g.items).slice(0, 3);
      if (weakList.length > 0) {
        const itemNames = weakList.map(w => `• **${w.title}** (${w.score}% retention, ${w.mistakesCount} mistakes logged)`).join('\n');
        return `Based on your recent recall decay and quiz performance, your memory retention is slipping in these critical areas:

${itemNames}

**Recommended QA Revision Drill:**
1. Head over to **Recall** mode to refresh the active flashcards.
2. Review **${weakList[0].title}** — especially common mistakes around: *${weakList[0].primaryTrap}*.
Would you like me to walk through a quick test question on ${weakList[0].title}?`;
      }
      return `Your overall retention is holding steady! Your current knowledge strength across XR QA is ${stats?.knowledgeStrength || 85}%. Keep testing your recall every few days to prevent decay.`;
    }

    // Handle Quick Action: "What should I learn next?"
    if (p.includes('learn next') || p.includes('next topic') || p.includes('what next')) {
      return `Looking at your curriculum progression (${stats?.overallProgress || 35}% completed):

1. **Immediate Focus:** Complete **${stats?.activeConcept?.title || 'Unity Profiler'}** (currently at ${stats?.activeConcept?.progress || 75}%). You need to master isolating Main Thread spikes vs Render Thread stalls.
2. **Next Module:** Jump into **04. XR Interaction Toolkit** to practice interactors and grab physics.
3. **Weak Area Remediation:** Spend 10 minutes on **ADB / Logcat** commands to get your confidence above 60%.

Shall we start a quick drill on Unity Profiler or test ADB commands?`;
    }

    // Handle Quick Action: "Give me a practice scenario" / "Scenario"
    if (p.includes('practice scenario') || p.includes('scenario') || p.includes('test scenario')) {
      const topicName = currentConcept?.title || 'XR Performance & Tracking';
      return `Here is a real-world QA practice scenario on **${topicName}**:

### 🧪 Scenario: High Reprojection During Hand-Tracking Transitions
**Environment:** Meta Quest 3, Standalone Release Build, 90Hz target.
**Issue:** When the player puts down physical controllers and switches to optical Hand Tracking in the main lobby, frame rate drops from 90 FPS down to 52 FPS. Reprojection rate spikes to 42%.

**Your QA Investigation Task:**
1. What ADB command would you run first to verify whether the CPU or GPU is saturated?
2. What engine subsystem commonly spikes when switching from controller models to skinned hand meshes?
3. What is the maximum frame time budget for 90Hz before reprojection begins?

*Take a moment to formulate your answer, then send it back to me for evaluation!*`;
    }

    // Handle Quick Action: "Test me" / "Quiz me"
    if (p.includes('test me') || p.includes('quiz me') || p.includes('question')) {
      const topic = currentConcept?.title || 'XR QA';
      return `Here is a targeted test question for you on **${topic}**:

**Question:**
In Standalone VR (like Meta Quest 3 targeting 72Hz), what is the maximum frame time budget, and what happens to the user experience if a frame takes 18ms to render?

**Options:**
A) Budget is 16.6ms; the headset displays an empty grey frame.
B) Budget is 13.88ms; the runtime reprojects (judder/double vision), increasing nausea risk.
C) Budget is 11.11ms; the game crashes immediately with an OOM error.
D) Budget is 8.33ms; the screen brightness dims automatically.

*Reply with your answer and your rationale!*`;
    }

    // Handle Quick Action: "Explain this" / Concept deep-dive
    if (p.includes('explain') || p.includes('how does') || p.includes('what is')) {
      if (currentConcept) {
        return `### 💡 Deep-Dive: ${currentConcept.title}

${currentConcept.explanation}

#### 🎯 Why It Matters in XR QA:
${currentConcept.whyItMattersForQa}

#### ⚡ Real-World XR Failure Example:
${currentConcept.realWorldExample}

#### ⚠️ Common Pitfalls to Test:
${currentConcept.commonMistakes?.map(m => `• ${m}`).join('\n') || '• Missing configuration tests on target hardware.'}

**Next Step:** Would you like to run a practice scenario or see an ADB command snippet for this?`;
      }
    }

    // Default intelligent pedagogical response
    return `Hello Vishal! I am your **XR QA AI Mentor**.

I have full real-time visibility into your learning workspace:
• **Current Subject:** XR / AR / VR Quality Assurance
• **Current Topic:** ${currentConcept?.title || 'XR Fundamentals & Profiling'}
• **Active Progress:** ${stats?.overallProgress || 35}% overall (${stats?.counts?.learned || 8} concepts mastered)
• **Key Weak Areas:** ADB Logcat, GPU Bottlenecks, XR Grab Interactable

You can ask me to:
1. *"Explain this topic with an XR bug example"*
2. *"Give me a tough practice scenario"*
3. *"Test me with a scenario question"*
4. *"What am I forgetting?"*
5. *"How do I isolate a Unity CPU vs GPU bottleneck?"*

What would you like to explore right now?`;
  }
}

/**
 * Gemini Provider (Optional: Activated when GEMINI_API_KEY is configured in .env)
 */
class GeminiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateResponse({ prompt, context, history }) {
    try {
      const systemContext = `You are an expert XR QA Lead and mentor teaching Vishal software testing and XR automation.
Current context:
- Subject: ${context?.subjectId}
- Current Concept: ${context?.currentConcept?.title}
- Weak Areas: ${JSON.stringify(context?.weakAreas?.map(w => w.moduleTitle))}
- Progress: ${context?.stats?.overallProgress}%
Answer concisely, technically, focusing on real-world QA engineering thinking, ADB commands, Unity profiler, and VR comfort.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemContext}\n\nStudent question: ${prompt}` }] }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } catch (err) {
      console.warn('Gemini call failed, falling back to Contextual Mock:', err.message);
      const fallback = new ContextualMockProvider();
      return await fallback.generateResponse({ prompt, context, history });
    }
  }
}

/**
 * AIService Factory & Manager
 */
class AIService {
  constructor() {
    this.initProvider();
  }

  initProvider() {
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey && process.env.AI_PROVIDER === 'gemini') {
      this.provider = new GeminiProvider(geminiKey);
      this.providerName = 'gemini';
    } else {
      this.provider = new ContextualMockProvider();
      this.providerName = 'contextual_mock';
    }
  }

  async chat({ prompt, context, history }) {
    return await this.provider.generateResponse({ prompt, context, history });
  }

  getStatus() {
    return {
      activeProvider: this.providerName,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
      isReady: true
    };
  }
}

export const aiService = new AIService();
