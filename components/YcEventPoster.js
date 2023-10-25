import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RecommendIcon from '@mui/icons-material/Recommend';
import { GET_EVENT_COMMENTS, INSERT_EVENT_COMMENT } from "@/lib/gqlQueries/ycFeedgql";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

const YcEventPoster = ({ eventData }) => {
  const router = useRouter();
  const { image, event_name: eventName, location, hours, date, entertainment, specialNotes, id: eventId } = eventData;
  const {loading: commentsLoading, data: commentsData} = useQuery(GET_EVENT_COMMENTS, { variables: { eventId }, pollInterval: 700, fetchPolicy: 'no-cache' });
  const [insertEventComment, {loading: commentLoading}] = useMutation(INSERT_EVENT_COMMENT);
  const isCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const [viewReplies, setViewReplies] = useState({});

  useEffect(() => {
    console.log('view replies', viewReplies)
  }, [viewReplies])

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

  const CommentList = ({ commentFacadeArrays }) => {
    const cleanField = { 
      msg: '', 
      parentId: null, 
      childComment: false
    };
    const [inputComment, setInputComment] = useState({ ...cleanField });
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

    if (!commentFacadeArrays) return <CircularProgress />

    const { parentComments } = commentFacadeArrays;
    return (
      <Stack>
        {parentComments.map((commentFacade, i) => {
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

  

  if (commentsLoading) return <CircularProgress />;
  const allComments = makeCommentsFacade(commentsData);

  return (
    <>
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto', marginBottom: 5, marginTop: 5 }} elevation={3}>
        <Stack display="flex" alignItems="center" sx={{margin: '0 auto', border: '1px solid black'}}>
          <Typography variant="h4" sx={{marginTop: 2}}>{ date }</Typography>
          <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography>
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
              padding: 5,
            }}
            alt="The house from the offer."
            src={image}
          />
          <Box sx={{margin: 2}}></Box>
          <Grid container justifyContent="space-around">
            <Typography variant="h6">
              Held at: { location }
            </Typography>
            <Typography variant="h6">
              Hours: { hours }
            </Typography>
          </Grid>
          <Stack sx={{margin: 2}} spacing={.5}>
            <Typography>Featuring special guest: {entertainment}</Typography>
            <Typography>SpecialNotes: { specialNotes }</Typography>
          </Stack>
          <Grid container justifyContent="space-around">
            <Button onClick={() => router.push({pathname: '/yachty/yc_feed/purchase_event_ticket', query: {eventId}})}>RSVP</Button>
            {isCommodore && <Button onClick={() => router.push({pathname: '/yachty/yc_feed/see_event_res', query: {eventId}})}>See Member RSVP</Button>}
          </Grid>
        </Stack>
        <>
          <Typography>
            members attending: 70
          </Typography>
          <CommentList commentFacadeArrays={allComments} />
        </>
      </Paper>
    </>
  )
};

export default YcEventPoster;