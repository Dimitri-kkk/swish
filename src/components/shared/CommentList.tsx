import { useState } from 'react';
import { useGetPostComments, useUpdateComment, useDeleteComment } from '@/lib/react-query/queriesAndMutations';
import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import { formatDateString } from '@/lib/utils';
import Loader from '@/components/shared/Loader';
import { Link } from 'react-router-dom';
import { IComment } from '@/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/context/AuthContext';
import { Pencil, Trash2, X, Check } from 'lucide-react';

type CommentListProps = {
  postId: string;
};

const CommentItem = ({ comment }: { comment: IComment }) => {
  const { user: currentUser } = useUserContext();
  const { data: user, isLoading, error } = useGetUserById(comment.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  console.log("Current user:", currentUser);
  console.log("Comment:", comment);
  console.log("Current user ID:", currentUser?.id);
  console.log("Comment user ID:", comment.userId);
  console.log("Do they match?", currentUser?.id === comment.userId);

  const isCommentOwner = currentUser?.id === comment.userId;

  const handleUpdateComment = () => {
    if (editedText.trim() === comment.text || !editedText.trim()) {
      setIsEditing(false);
      setEditedText(comment.text);
      return;
    }

    updateComment(
      { commentId: comment.$id, text: editedText.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error) => {
          console.error('Error updating comment:', error);
          setEditedText(comment.text);
          setIsEditing(false);
        }
      }
    );
  };

  const handleDeleteComment = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      console.log("Attempting to delete comment:", comment.$id, "for post:", comment.postId);
      
      deleteComment(
        { commentId: comment.$id, postId: comment.postId },
        {
          onSuccess: () => {
            console.log("Comment deleted successfully");
          },
          onError: (error) => {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment. Please try again.");
          }
        }
      );
    }
  };

  if (isLoading) return (
    <div className="flex items-center gap-2 p-4 border-b border-dark-4">
      <div className="w-10 h-10 rounded-full bg-dark-3 animate-pulse"></div>
      <div className="flex-1">
        <div className="w-24 h-4 bg-dark-3 rounded animate-pulse mb-2"></div>
        <div className="w-full h-4 bg-dark-3 rounded animate-pulse"></div>
      </div>
    </div>
  );

  if (error || !user) return (
    <div className="flex gap-3 p-4 border-b border-dark-4">
      <img 
        src="/assets/icons/profile-placeholder.svg" 
        alt="profile" 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-light-1">Unknown User</p>
          <p className="text-light-3 text-xs">
            {formatDateString(comment.createdAt)}
          </p>
        </div>
        <p className="text-light-2 mt-1">{comment.text}</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="flex gap-3 p-4 border-b border-dark-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/profile/${user.$id}`}>
        <img 
          src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
          alt="profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user.$id}`} className="font-semibold text-light-1">
              {user.name}
            </Link>
            <p className="text-light-3 text-xs">
              {formatDateString(comment.createdAt)}
            </p>
          </div>
          
          {isCommentOwner && !isEditing && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-light-3 hover:text-light-1"
                onClick={() => setIsEditing(true)}
                disabled={isDeleting}
              >
                <Pencil size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-light-3 hover:text-red-500"
                onClick={handleDeleteComment}
                disabled={isDeleting || isUpdating}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full resize-none bg-dark-3 text-light-1 outline-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
              rows={2}
              disabled={isUpdating}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-light-3 hover:text-light-1"
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(comment.text);
                }}
                disabled={isUpdating}
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-primary-500 hover:bg-primary-600"
                onClick={handleUpdateComment}
                disabled={isUpdating || !editedText.trim() || editedText.trim() === comment.text}
              >
                {isUpdating ? (
                  <>
                    <span className="w-3 h-3 animate-spin rounded-full border-2 border-t-transparent border-white mr-1"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-1" /> Save
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-light-2 mt-1">{comment.text}</p>
        )}
      </div>
    </motion.div>
  );
};

const CommentList = ({ postId }: CommentListProps) => {
  const { data: comments, isLoading, error } = useGetPostComments(postId);

  if (isLoading) return (
    <div className="w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 p-4 border-b border-dark-4">
          <div className="w-10 h-10 rounded-full bg-dark-3 animate-pulse"></div>
          <div className="flex-1">
            <div className="w-24 h-4 bg-dark-3 rounded animate-pulse mb-2"></div>
            <div className="w-full h-4 bg-dark-3 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        Failed to load comments. Please try refreshing the page.
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="text-light-3 text-center py-6">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="w-full">
      {comments.map((comment) => (
        <CommentItem key={comment.$id} comment={comment as unknown as IComment} />
      ))}
    </div>
  );
};

export default CommentList; 