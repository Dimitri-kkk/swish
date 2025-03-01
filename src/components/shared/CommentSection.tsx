import { useState, useEffect } from 'react';
import CommentForm from '@/components/forms/CommentForm';
import CommentList from '@/components/shared/CommentList';
import { useUserContext } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys';

type CommentSectionProps = {
  postId: string;
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const queryClient = useQueryClient();

  // Set up polling for comments to enable real-time updates
  useEffect(() => {
    // Poll for new comments every 10 seconds
    const interval = setInterval(() => {
      if (postId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId]
        });
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [postId, queryClient]);

  const handleCommentAdded = () => {
    // Force refresh the comment list immediately after adding a comment
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_POST_COMMENTS, postId]
    });
    
    // Also update the refreshKey to force a re-render
    setRefreshKey(prev => prev + 1);
  };

  if (!postId) return null;

  return (
    <div className="w-full flex flex-col gap-6 mt-8">
      <h3 className="text-xl font-bold text-light-1">Comments</h3>
      
      {user ? (
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      ) : (
        <p className="text-light-3">Sign in to leave a comment</p>
      )}
      
      <div key={refreshKey} className="w-full">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};

export default CommentSection; 