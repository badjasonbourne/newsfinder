import { create } from 'zustand';

const useStore = create((set) => ({
  // News state
  news: [],
  loading: true,
  error: null,
  activeTag: '全部',
  tags: ['全部'],
  setNews: (news) => set({ news }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setActiveTag: (activeTag) => set({ activeTag }),
  setTags: (tags) => set({ tags }),

  // Tool selector state
  currentTool: 'default',
  toolSelectorOpen: false,
  toolSelectorPosition: { x: 0, y: 0 },
  hoveredTool: null,
  setCurrentTool: (currentTool) => set({ currentTool }),
  setToolSelectorOpen: (toolSelectorOpen) => set({ toolSelectorOpen }),
  setToolSelectorPosition: (toolSelectorPosition) => set({ toolSelectorPosition }),
  setHoveredTool: (hoveredTool) => set({ hoveredTool }),

  // Selection state
  selectedNews: [],
  lastSelectedNews: [],
  isSelecting: false,
  showReport: false,
  setSelectedNews: (selectedNews) => set({ selectedNews }),
  setLastSelectedNews: (lastSelectedNews) => set({ lastSelectedNews }),
  setIsSelecting: (isSelecting) => set({ isSelecting }),
  setShowReport: (showReport) => set({ showReport }),

  // Actions
  handleToolSelect: (tool) => set((state) => {
    if (tool === 'lasso') {
      return {
        currentTool: tool,
        toolSelectorOpen: false,
        hoveredTool: null,
        isSelecting: true,
        selectedNews: state.lastSelectedNews,
      };
    } else {
      return {
        currentTool: tool,
        toolSelectorOpen: false,
        hoveredTool: null,
        isSelecting: false,
        lastSelectedNews: state.selectedNews,
        selectedNews: [],
      };
    }
  }),

  handleNewsSelect: (newsItem) => set((state) => {
    if (state.currentTool !== 'lasso') return state;

    const isSelected = state.selectedNews.some(item => item.id === newsItem.id);
    const newSelection = isSelected
      ? state.selectedNews.filter(item => item.id !== newsItem.id)
      : [...state.selectedNews, newsItem];

    return {
      selectedNews: newSelection,
      lastSelectedNews: newSelection,
    };
  }),

  // Fetch news action
  fetchNews: async () => {
    set({ loading: true });
    try {
      const [data] = await Promise.all([
        fetch('http://localhost:8000/api/news').then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }
          return response.json();
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      const uniqueTags = ['全部', ...new Set(data.map(item => item.tag).filter(Boolean))];
      
      set({
        news: data,
        tags: uniqueTags,
        error: null,
      });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useStore; 