import { useState } from 'react';

interface ShareBarProps {
  title: string;
  url?: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500',
    },
    {
      name: 'Zalo',
      icon: '💬',
      url: `https://zalo.me/share?url=${encodedUrl}`,
      color: 'hover:bg-blue-500',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Chia sẻ:</span>
      <div className="flex gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-gray-100 text-gray-700 transition-colors ${link.color} hover:text-white text-lg`}
            title={`Chia sẻ trên ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className={`p-2 px-3 rounded-full transition-colors text-sm ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={copied ? 'Đã copy!' : 'Copy link'}
        >
          {copied ? '✓ Đã copy' : '🔗 Copy link'}
        </button>
      </div>
    </div>
  );
}
