const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");
admin.initializeApp();
const {db} = require('./util/admin');

const { getPages,getallPage, postPages ,putPages ,deletePages} = require('./handlers/page');
const { getPageLike, postPageLike ,deletePageLike} = require('./handlers/pageLike');
const { getPagePost,getallPagePost, postPagePost ,putPagePost, deletePagePost} = require('./handlers/pagePost');
const { postPostLike, deletePostlike} = require('./handlers/postLike');
const { getallpostcomment, postPostComment ,putPostComment, deletePostComment} = require('./handlers/postComment');
const { postCommentLike, deleteCommentLike} = require('./handlers/commentLike');

// Pages

app.post('/createPages', postPages);
app.post('/createPageLike/:pagesId',postPageLike);
app.post('/createPagePosts/:pagesId', postPagePost);
app.post('/createPostLike/:pagesId/:pagePostsId',postPostLike);
app.post('/createPostComments/:pagesId/:pagePostsId', postPostComment);
app.post('/createCommentLike/:pagesId/:pagePostsId/:postCommentsId', postCommentLike);

app.get('/readPages/:pagesId', getPages); 
app.get('/readPages',getallPage);
app.get('/readPagePosts/:pagesId/:pagePostsId',getPagePost );
app.get('/readPagePosts/:pagesId/',getallPagePost );
app.get('/readPageLike/:pagesId',getPageLike);
app.get('/readPostComments/:pagesId/:pagePostsId',getallpostcomment);

app.put("/updatePages/:pagesId", putPages)
app.put('/updatePagePosts/:pagesId/:pagePostsId', putPagePost );
app.put('/updatePostComments/:pagesId/:pagePostsId/:postCommentsId', putPostComment);

app.delete('/deletePages/:pagesId',deletePages);
app.delete('/deletePageLike/:pagesId/:pageLikeId',deletePageLike);
app.delete('/deletePagePosts/:pagesId/:pagePostsId', deletePagePost);     
app.delete('/deletePostComments/:pagesId/:pagePostsId/:postCommentsId', deletePostComment ); 
app.delete('/deleteCommentLike/:pagesId/:pagePostsId/:postCommentsId/:commentsLike', deleteCommentLike );
app.delete('/deletePostLike/:pagesId/:pagePostsId/:postlikeId', deletePostlike );

//notifications

exports.api =functions.https.onRequest(app);

exports.createNotificationOnlike = functions
.region('europe_west3')
.firestore.document('/PostLike/{id}')
.onCreate((snapshot) =>{
      db.doc(`/PagePosts/${snapshot.data().pagePostsId}`)
      .get()
      .then(doc =>{
          if(doc.exists){
               return db.doc(`/notifications/${snapshot.id}`).add({
                   createdAt: new Date().toISOString(),
                   recipient:doc.data().username,
                   sesnder:snapshot.data().username,
                   type:'like',
                   read: false,
                   pagePostsId:doc.id

               });
            }
      })
      .then(() =>{
          return ;
      })
      .catch(err =>{ 
          console.error(err);
            return ;
    });
  });
  exports.createNotificationOnUnlike = functions.region('europe_west3').firestore.document('/Postlike/{id}')
  .onDelete((snapshot)=>{
    db.doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(()=>{
      return;
    })
    .catch(err =>{
      console.error(err);
      return;
    })
  });
  exports.createNotificationOncomment = functions.region('europe_west3').firestore.document('/PostComments/{id}')
  .onCreate((snapshot) =>{
      db.doc(`/PagePosts/${snapshot.data().pagePostsId}`).get().then(doc =>{
          if(doc.exists){
               return db.doc(`/notifications/${snapshot.id}`).set({
                   createdAt: new Date().toISOString(),
                   recipient:doc.data().username,
                   sesnder:snapshot.data().username,
                   type:'comment',
                   read: false,
                   pagePostsId:doc.id

               });
            }
      })
      .then(() =>{
          return ;
      })
      .catch(err =>{ 
          console.error(err);
            return ;
    });
  });


