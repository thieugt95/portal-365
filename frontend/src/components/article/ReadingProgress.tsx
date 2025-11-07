import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  targetId?: string;
}

export default function ReadingProgress({ targetId = 'article-content' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollTop;
      const elementHeight = el.offsetHeight;
      const windowHeight = window.innerHeight;

      // Tính phần trăm đã scroll qua element
      const scrolled = scrollTop - elementTop + windowHeight;
      const percentage = Math.min(100, Math.max(0, (scrolled / elementHeight) * 100));

      setProgress(percentage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Tính lần đầu

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
