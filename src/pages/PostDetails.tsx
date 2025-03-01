import CommentSection from '@/components/shared/CommentSection';

const PostDetails = () => {
  // ... existing code
  
  return (
    <div className="post_details-container">
      {/* Your existing post details UI */}
      
      {/* Add the comment section */}
      <CommentSection postId={post.$id} />
    </div>
  );
};

export default PostDetails; 