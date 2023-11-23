import { GET_EVENT_COMMENTS } from "@/lib/gqlQueries/ycFeedgql";
import { useQuery } from "@apollo/client";


const makeCommentsFacade = (data) => {
  let commentArrays = {
    parentComments: []
  };
  data.comments.forEach(commentObj => {
    const { id, comment, createdAt, parentId, yc_member: { profilePic, firstName } } = commentObj;   
    const facade = {
      comment,
      createdAt,
      parentId,
      authorPic: profilePic,
      author: firstName,
      commentId: id,
    };

    if (parentId === null) {
      commentArrays.parentComments.push(facade);
    } else {
      if (commentArrays.hasOwnProperty(parentId)) {
        commentArrays[parentId].push(facade);
      } else {
        commentArrays[parentId] = [facade];
      }
    }
  });
  return commentArrays;
}

export const useEventCommentsFacade = (eventId) => {
  const { loading: commentsLoading, data: commentsData } = useQuery(GET_EVENT_COMMENTS, { variables: { eventId }, pollInterval: 700, fetchPolicy: 'no-cache' });
  let commentFacadeArrays = {parentComments: []};

  if (commentsLoading) return {commentFacadeArrays, commentsLoading}  
  commentFacadeArrays = makeCommentsFacade(commentsData);
  
  return { commentFacadeArrays, commentsLoading };
}