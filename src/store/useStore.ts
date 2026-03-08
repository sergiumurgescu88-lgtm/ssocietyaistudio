import { create } from 'zustand';
import { geminiService } from '../services/gemini';
import { kieService } from '../services/kie';
import { ttsService } from '../services/tts';

interface AssetState {
  content?: string;
  url?: string;
  status: 'pending' | 'generating' | 'ready' | 'failed';
  approved: boolean;
}

interface SpeakerNames {
  female: string;
  male: string;
}

interface ProjectState {
  currentStep: number;
  projectData: {
    name: string;
    duration: number;
    description: string;
    audience: string[];
  } | null;
  speakerNames: {
    global: SpeakerNames;
    project: SpeakerNames & { useCustom: boolean };
  };
  assets: {
    script: AssetState & { content: string };
    audio: AssetState & { url: string };
    thumbnail: AssetState & { url: string };
    video: AssetState & { url: string };
    seoContent: { content: unknown; status: 'pending' | 'generating' | 'ready' | 'failed'; approved: boolean };
  };
  setCurrentStep: (step: number) => void;
  setProjectData: (data: ProjectState['projectData']) => void;
  setGlobalSpeakerNames: (female: string, male: string) => void;
  setProjectSpeakerNames: (female: string, male: string, useCustom: boolean) => void;
  getActiveSpeakerNames: () => SpeakerNames;
  generateScript: () => Promise<void>;
  generateAudio: (script: string) => Promise<void>;
  generateThumbnail: (prompt: string) => Promise<void>;
  generateVideo: (options: Parameters<typeof kieService.generateVideo>[0]) => Promise<void>;
  generateSEO: () => Promise<void>;
  approveAsset: (asset: keyof ProjectState['assets']) => void;
  resetAssets: () => void;
}

const defaultAssets: ProjectState['assets'] = {
  script: { content: '', status: 'pending', approved: false },
  audio: { url: '', status: 'pending', approved: false },
  thumbnail: { url: '', status: 'pending', approved: false },
  video: { url: '', status: 'pending', approved: false },
  seoContent: { content: null, status: 'pending', approved: false },
};

export const useStore = create<ProjectState>((set, get) => ({
  currentStep: 1,
  projectData: null,
  speakerNames: {
    global: { female: 'Alina', male: 'Sergiu' },
    project: { female: 'Alina', male: 'Sergiu', useCustom: false },
  },
  assets: { ...defaultAssets },

  setCurrentStep: (step) => set({ currentStep: step }),
  setProjectData: (data) => set({ projectData: data }),
  setGlobalSpeakerNames: (female, male) => set((s) => ({
    speakerNames: { ...s.speakerNames, global: { female, male } },
  })),
  setProjectSpeakerNames: (female, male, useCustom) => set((s) => ({
    speakerNames: { ...s.speakerNames, project: { female, male, useCustom } },
  })),
  getActiveSpeakerNames: () => {
    const { speakerNames } = get();
    return speakerNames.project.useCustom
      ? { female: speakerNames.project.female, male: speakerNames.project.male }
      : speakerNames.global;
  },

  generateScript: async () => {
    set((s) => ({ assets: { ...s.assets, script: { ...s.assets.script, status: 'generating' } } }));
    try {
      const { projectData } = get();
      if (!projectData) throw new Error('No project data');
      const content = await geminiService.generateScript(projectData);
      set((s) => ({ assets: { ...s.assets, script: { content, status: 'ready', approved: false } } }));
    } catch {
      set((s) => ({ assets: { ...s.assets, script: { ...s.assets.script, status: 'failed' } } }));
    }
  },

  generateAudio: async (script) => {
    set((s) => ({ assets: { ...s.assets, audio: { ...s.assets.audio, status: 'generating' } } }));
    try {
      const url = await ttsService.generate({ text: script, speaker: 'alina' });
      set((s) => ({ assets: { ...s.assets, audio: { url, status: 'ready', approved: false } } }));
    } catch {
      set((s) => ({ assets: { ...s.assets, audio: { ...s.assets.audio, status: 'failed' } } }));
    }
  },

  generateThumbnail: async (prompt) => {
    set((s) => ({ assets: { ...s.assets, thumbnail: { ...s.assets.thumbnail, status: 'generating' } } }));
    try {
      const url = await geminiService.generateImage(prompt);
      set((s) => ({ assets: { ...s.assets, thumbnail: { url, status: 'ready', approved: false } } }));
    } catch {
      set((s) => ({ assets: { ...s.assets, thumbnail: { ...s.assets.thumbnail, status: 'failed' } } }));
    }
  },

  generateVideo: async (options) => {
    set((s) => ({ assets: { ...s.assets, video: { ...s.assets.video, status: 'generating' } } }));
    try {
      const result = await kieService.generateVideo(options);

      const pollStatus = async () => {
        const status = await kieService.getVideoStatus(result.id);
        if (status.status === 'completed') {
          set((s) => ({ assets: { ...s.assets, video: { url: status.url || '', status: 'ready', approved: false } } }));
        } else if (status.status === 'failed') {
          set((s) => ({ assets: { ...s.assets, video: { ...s.assets.video, status: 'failed' } } }));
        } else {
          setTimeout(pollStatus, 5000);
        }
      };
      pollStatus();
    } catch {
      set((s) => ({ assets: { ...s.assets, video: { ...s.assets.video, status: 'failed' } } }));
    }
  },

  generateSEO: async () => {
    set((s) => ({ assets: { ...s.assets, seoContent: { ...s.assets.seoContent, status: 'generating' } } }));
    try {
      const { projectData } = get();
      if (!projectData) throw new Error('No project data');
      const content = await geminiService.generateSEOContent({ name: projectData.name });
      set((s) => ({ assets: { ...s.assets, seoContent: { content, status: 'ready', approved: false } } }));
    } catch {
      set((s) => ({ assets: { ...s.assets, seoContent: { ...s.assets.seoContent, status: 'failed' } } }));
    }
  },

  approveAsset: (asset) => {
    set((s) => ({
      assets: { ...s.assets, [asset]: { ...s.assets[asset], approved: true } },
    }));
  },

  resetAssets: () => set({ assets: { ...defaultAssets } }),
}));
