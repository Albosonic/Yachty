import { useState } from "react";
import { useEventCommentsFacade } from "./componentHooks/useEventCommentsFacade";
import RecommendIcon from '@mui/icons-material/Recommend';
import { INSERT_EVENT_COMMENT } from "@/lib/gqlQueries/ycFeedgql";
import {  Button, CircularProgress, Grid, IconButton, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";

const cleanField = { 
  msg: '', 
  parentId: null, 
  childComment: false
};

const EventCommentsList = ({ eventId }) => {
  const memberId = useSelector(state => state?.auth?.member?.id);
  const {commentFacadeArrays, loading} = useEventCommentsFacade(eventId);
  const [insertEventComment, {loading: commentLoading}] = useMutation(INSERT_EVENT_COMMENT);
  const [showParents, setShowParents] = useState(false);
  const [inputComment, setInputComment] = useState({ ...cleanField });
  const [viewReplies, setViewReplies] = useState({});
  const { parentIdCommentId, msg: inputMsg, childComment } = inputComment;

  const sendComment = async () => {
    if (inputMsg === '') return;
    await insertEventComment({
      variables: {
        object: {
          eventId,
          memberId,
          parentId: parentIdCommentId,
          comment: inputMsg,
          createdAt: new Date().toISOString(),
        }
      }
    });
    setInputComment({...cleanField});
  }

  const sendReply = async (commentId) => {
    if (inputMsg === '') return;
    await insertEventComment({
      variables: {
        object: {
          eventId,
          memberId,
          parentId: parentIdCommentId,
          comment: inputMsg,
          createdAt: new Date().toISOString(),
        }
      }
    })      
    setInputComment({...cleanField});
    setViewReplies({...viewReplies, [commentId]: true});
  };

  if (loading) return <CircularProgress />

  const { parentComments } = commentFacadeArrays;

  return (
    <Stack>
      <Typography variant="body1">{parentComments.length > 0 && parentComments[parentComments.length - 1].comment}</Typography>
      { parentComments.map((commentFacade, i) => {
        const {
          comment,
          createdAt,
          parentId,
          authorPic,
          author,
          commentId
        } = commentFacade;
        
        const childComments = commentFacadeArrays[commentId] ? commentFacadeArrays[commentId] : null;
        
        return (
          <Stack key={comment + i}>
            <Stack justifyContent="space-between">
              <Grid  container justifyContent="space-between">
                <Stack>
                  <Typography variant="subtitle2">
                    {comment}
                  </Typography>
                  <Button sx={{fontSize: 9, padding: 1, margin: 1}} variant="standard" onClick={() => {
                    setViewReplies({...viewReplies, [commentId]: !viewReplies[commentId]})                      
                  }}>
                    view replies
                  </Button>  
                </Stack>
                <Button sx={{padding: 1, fontSize: 9, margin: 1, maxHeight: 40}} variant="standard" onClick={() => {
                  setInputComment({ parentIdCommentId: commentId, msg: '', childComment: true })
                }}>
                  reply
                </Button>
              </Grid>
              {parentIdCommentId === commentId && (
                <TextField
                  sx={{width: '70%'}}
                  multiline
                  label="reply"
                  value={inputMsg}
                  onChange={(e) => setInputComment({parentIdCommentId: parentIdCommentId, msg: e.target.value})}
                  InputProps={{endAdornment: <Button onClick={() => sendReply(commentId)}>Send</Button>}}
                  variant="standard"
                />
              )}
            </Stack>
            {childComments && childComments.map((childCommentFacade, j) => {
              const {
                comment: childComment,
                createdAt,
                parentId: childParentId,
                authorPic,
                author,
                commentId: childCommentId
              } = childCommentFacade;
              const viewRepliesById = viewReplies[childParentId];
              if (!viewRepliesById) return null;
              return (
                <Stack key={childComment + j + childCommentId} sx={{ marginLeft: 3 }}>
                  <Grid container justifyContent="space-between">
                    <Typography variant="subtitle2">
                      {childComment}
                    </Typography>                      
                    <IconButton size="small" sx={{padding: 1, marginRight: 2}} onClick={() => console.log('write the like functionality berto')}>
                      <RecommendIcon color="primary"/>
                    </IconButton>
                  </Grid>
                </Stack>
              )
            })}
          </Stack>
        )
      })}      
      {(childComment === false) && <TextField
        sx={{width: '80%', alignSelf: 'center'}}
        multiline
        label="comment"
        value={inputMsg}
        onChange={(e) => setInputComment({...inputComment, msg: e.target.value,})}
        InputProps={{endAdornment: <Button onClick={sendComment}>Send</Button>}}
        variant="standard"
      />}
    </Stack>
  )
};

export default EventCommentsList;