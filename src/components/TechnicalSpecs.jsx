import { motion } from 'framer-motion';
import { Radio, Cpu, Zap, FileText, ExternalLink, GitBranch, Database, Settings, Layers, Server, TrendingUp, Award, BarChart3, Clock } from 'lucide-react';

export default function TechnicalSpecs() {
  const pipeline = [
    {
      icon: Radio,
      title: 'Farmer Query',
      description: 'Audio Input & Preprocessing',
      details: ['16kHz resampling', 'Log-Mel Spectrograms', '30s max duration padding'],
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: Layers,
      title: 'Stage 1: Base Model',
      description: 'General Malayalam Training',
      details: ['Dataset: Be-win/malayalam-speech', 'LoRA Rank 32', 'High LR (1e-3)'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      icon: GitBranch,
      title: 'Stage 2: Domain Adapter',
      description: 'Agricultural Fine-Tuning',
      details: ['Dataset: Custom Agri-Corpus', 'LoRA Rank 16', 'Low LR (5e-5)'],
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
    {
      icon: Server,
      title: 'Inference Engine',
      description: 'Optimized Deployment',
      details: ['8-bit Quantization (Int8)', 'Beam Search (5 beams)', 'L4/T4 GPU Support'],
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      icon: FileText,
      title: 'English Output',
      description: 'Ready for AI Processing',
      details: ['Domain-accurate terminology', 'Context-aware translation', 'Agri-AI ready'],
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
  ];

  const resources = [
    {
      title: 'General Training Dataset',
      description: 'Be-win/malayalam-speech-with-english-translation (HuggingFace)',
      link: 'https://huggingface.co/datasets/Be-win/malayalam-speech-with-english-translation',
      tag: 'Base Dataset',
    },
    {
      title: 'OpenAI Whisper Paper',
      description: 'Robust Speech Recognition via Large-Scale Weak Supervision',
      link: 'https://arxiv.org/abs/2212.11972',
      tag: 'Research',
    },
    {
      title: 'LoRA: Low-Rank Adaptation',
      description: 'Parameter-Efficient Fine-Tuning methodology',
      link: 'https://arxiv.org/abs/2106.09685',
      tag: 'Methodology',
    },
    {
      title: 'Agricultural Domain Dataset',
      description: 'Custom parallel corpus of farmer queries and expert translations',
      link: '#',
      tag: 'Private Dataset',
    },
  ];

  const metrics = [
    { label: 'BLEU Score', value: '56.89', trend: 'up' },
    { label: 'Domain Accuracy', value: 'High', trend: 'up' },
    { label: 'Base Training Time', value: '~24 hrs', trend: 'neutral' },
    { label: 'Fine-Tuning Time', value: '~8 hrs', trend: 'down' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Pipeline Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold font-display mb-10 text-center text-gradient"
        >
          Two-Stage Translation Pipeline
        </motion.h2>

        <div className="grid md:grid-cols-5 gap-4">
          {pipeline.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass ${step.borderColor} rounded-xl p-6 relative group hover:bg-white/5 transition-colors`}
            >
              {/* Connector Arrow */}
              {index < pipeline.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 text-slate-600">
                  →
                </div>
              )}

              <div className={`w-12 h-12 ${step.bgColor} rounded-lg flex items-center justify-center mb-4 border border-white/5`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>

              <h3 className={`font-display font-semibold mb-1 ${step.color}`}>{step.title}</h3>
              <p className="text-slate-400 text-sm mb-3 font-light">{step.description}</p>

              <ul className="space-y-1">
                {step.details.map((detail, i) => (
                  <li key={i} className="text-slate-500 text-xs font-mono flex items-start">
                    <span className={`${step.color} mr-2`}>›</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Performance & Training Metrics */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold font-display mb-6 text-center"
        >
          System Performance & Efficiency
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Performance Comparison Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 glass rounded-xl p-6 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold font-display text-white">
                Model Comparison
              </h3>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-300">COMET Metric</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    v2.0
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  Evaluated on 300 unseen inputs (Higher is better)
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 px-3 self-start sm:self-auto">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-0.5">
                  <TrendingUp className="w-3 h-3" />
                  Lift
                </div>
                <div className="text-lg font-mono font-bold text-white leading-none">
                  +62.4%
                </div>
              </div>
            </div>

            <div className="space-y-6 relative">
              {/* Context Line - Human Parity */}
              <div className="absolute top-0 bottom-0 left-[80%] w-px border-l border-dashed border-slate-600/50 hidden sm:block">
                <div className="absolute -top-6 -left-8 text-[10px] text-slate-500 whitespace-nowrap">
                  Human Parity (~80)
                </div>
              </div>

              {[
                { name: 'Whisper Medium', score: 42.5, desc: 'Baseline (Zero-shot)', color: 'bg-slate-600', textColor: 'text-slate-400' },
                { name: 'General Malayalam', score: 58.2, desc: 'Common Voice Trained', color: 'bg-blue-500', textColor: 'text-blue-400' },
                { name: 'Agri-Connect LoRA', score: 69.0, desc: 'Fine-tuned Agri-Data', color: 'bg-gradient-to-r from-emerald-500 to-teal-400', textColor: 'text-emerald-400', isHero: true }
              ].map((model, index) => (
                <div key={index} className="relative group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                      <span className={`font-medium text-sm ${model.isHero ? 'text-white' : 'text-slate-300'}`}>{model.name}</span>
                      <span className="text-[10px] text-slate-500">{model.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {model.isHero && <Award className="w-4 h-4 text-emerald-400 animate-pulse" />}
                      <span className={`font-mono text-base font-bold ${model.textColor}`}>{model.score.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${model.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: index * 0.15, ease: "circOut" }}
                      className={`h-full rounded-full relative ${model.color} ${model.isHero ? 'shadow-[0_0_15px_rgba(16,185,129,0.4)]' : ''}`}
                    >
                      {model.isHero && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Training Scale / Time Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-secondary" />
              <h3 className="text-xl font-bold font-display text-white">
                Training Efficiency
              </h3>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-8">
              {/* Comparison 1 */}
              <div className="relative pl-4 border-l-2 border-slate-700">
                <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Standard Fine-tuning</h4>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-2xl font-mono font-bold text-white">~24h</span>
                </div>
                <p className="text-xs text-slate-500">Requires high-end GPU clusters (A100s)</p>
              </div>

              {/* Comparison 2 */}
              <div className="relative pl-4 border-l-2 border-emerald-500">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <h4 className="text-emerald-400 text-xs uppercase tracking-wider font-semibold mb-1">LoRA Adaptation</h4>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-4xl font-mono font-bold text-white">~8h</span>
                </div>
                <p className="text-xs text-slate-400">Efficient training on consumer GPUs (T4/L4)</p>
                <div className="mt-2 inline-block px-2 py-1 bg-emerald-500/10 rounded text-[10px] text-emerald-300 font-mono">
                  3x Faster
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Details */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold font-display mb-6 text-center"
        >
          Technical Configurations
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LoRA Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-semibold text-secondary">LoRA Configurations (Stage 2)</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Rank (r)</span>
                <span className="text-white font-mono text-sm">16</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Alpha (α)</span>
                <span className="text-white font-mono text-sm">64</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Dropout</span>
                <span className="text-white font-mono text-sm">0.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Target Modules</span>
                <span className="text-white font-mono text-sm">q_proj, v_proj, k_proj, out_proj</span>
              </div>
            </div>
          </motion.div>

          {/* Training Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-semibold text-secondary">Training Hyperparameters</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Base Learning Rate</span>
                <span className="text-white font-mono text-sm">1e-3 (AdamW)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Fine-Tune LR</span>
                <span className="text-white font-mono text-sm">5e-5 (Low)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 text-sm">Precision</span>
                <span className="text-white font-mono text-sm">BFloat16 (L4 Optimized)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Batch Size</span>
                <span className="text-white font-mono text-sm">8 (Accumulated to 16/32)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Citations & Resources */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold font-display mb-6 text-center"
        >
          Citations & Resources
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <motion.a
              key={index}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-secondary text-xs font-mono rounded mb-2">
                    {resource.tag}
                  </span>
                  <h3 className="font-display font-semibold text-white group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-slate-400 text-sm font-light">{resource.description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Use Case Section */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-8"
        >
          <h3 className="text-xl font-display font-semibold mb-6 text-center text-secondary">
            Real-World Application Flow
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-mono font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Farmer speaks query in Malayalam</h4>
                <p className="text-slate-400 text-sm italic">Example: "എന്റെ തക്കാളിയിൽ ഇല പുള്ളി രോഗം വന്നിട്ടുണ്ട്"</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-mono font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Model translates to English</h4>
                <p className="text-slate-400 text-sm italic">Output: "My tomatoes have leaf spot disease"</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-mono font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Agricultural AI processes query</h4>
                <p className="text-slate-400 text-sm">English-based crop advisory system provides treatment recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-mono font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Farmer receives actionable advice</h4>
                <p className="text-slate-400 text-sm">Response can be translated back or presented in a multilingual format</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}