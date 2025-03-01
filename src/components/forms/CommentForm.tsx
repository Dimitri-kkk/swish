import { useState } from 'react';
import { useAddComment } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type CommentFormProps = {
  postId: string;
  onCommentAdded?: () => void;
};

const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { user } = useUserContext();
  const { mutate: addComment, isPending } = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }
    
    addComment({
      postId,
      userId: user.id,
      text: comment.trim()
    }, {
      onSuccess: () => {
        setComment('');
        if (onCommentAdded) onCommentAdded();
      },
      onError: (error) => {
        console.error('Error posting comment:', error);
        setError('Failed to post comment. Please try again.');
      }
    });
  };

  console.log("User in CommentForm:", user);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full resize-none bg-dark-3 text-light-1 outline-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
          rows={3}
          disabled={isPending}
        />
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="shad-button_primary flex items-center gap-2"
            disabled={isPending || !comment.trim()}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
                Posting...
              </>
            ) : 'Post Comment'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 