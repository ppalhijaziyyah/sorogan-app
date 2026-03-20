import { useState, useEffect, useContext } from 'react';
import masterIndex from '../data/master-index.json';
import { AppContext } from '../contexts/AppContext';

// Vite's import.meta.glob provides a map of paths to dynamic import functions.
// We use an absolute path from the project root to avoid ambiguity.
const lessonModules = import.meta.glob('/src/data/**/*.json');

export function useLesson(lessonId) {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { previewLessons } = useContext(AppContext);

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setLessonData(null);

      try {
        if (lessonId.startsWith('preview-lesson-')) {
          const levelId = lessonId.replace('preview-lesson-', '');
          const levelMap = { '1': 'Ibtida’i', '2': 'Mutawassit', '3': 'Mutaqaddim' };
          const levelName = levelMap[levelId];
          const previewLesson = previewLessons[levelName];
          
          if (previewLesson) {
            setLessonData({ ...previewLesson, id: lessonId });
          } else {
            throw new Error("Data materi pratinjau tidak memuat. Silakan upload ulang dari halaman depan.");
          }
          return;
        }

        const lessonInfo = masterIndex.find(l => l.id === lessonId);
        if (!lessonInfo) {
          throw new Error(`Pelajaran dengan ID "${lessonId}" tidak ditemukan.`);
        }

        // The path in the JSON is like "data/1-ibtidai/1-1-rukun-islam.json"
        // The key in lessonModules is like "/src/data/1-ibtidai/1-1-rukun-islam.json"
        const modulePath = `/src/${lessonInfo.path}`;

        const moduleImporter = lessonModules[modulePath];
        if (!moduleImporter) {
          throw new Error(`File pelajaran tidak ditemukan di path: ${modulePath}. Periksa 'path' di master-index.json.`);
        }

        const module = await moduleImporter();
        const data = module.default || module;

        if (!data || !Array.isArray(data.textData)) {
          throw new Error(`Data pelajaran tidak valid untuk: ${lessonId}`);
        }
        
        data.id = lessonId;
        setLessonData(data);

      } catch (e) {
        setError(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lessonId]);

  return { lessonData, loading, error };
}
