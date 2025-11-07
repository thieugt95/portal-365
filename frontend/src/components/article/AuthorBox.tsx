interface AuthorBoxProps {
  author: {
    id: number;
    name: string;
    avatar_url?: string;
    username?: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  const avatarUrl = author.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`;

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">Tác giả</h3>
          <p className="text-lg font-medium text-blue-600">{author.name}</p>
          {author.username && (
            <p className="text-sm text-gray-500">@{author.username}</p>
          )}
        </div>
      </div>
    </div>
  );
}
