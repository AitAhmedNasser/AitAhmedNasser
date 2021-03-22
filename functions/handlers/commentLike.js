const {db} = require('../util/admin');
exports.postCommentLike= ((req, res)=>{
    const likeDocument = db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostComments').doc(req.params.postCommentsId).collection('CommentsLike')//.where('pagePostsId', '==' , req.params.pagePostsId).limit(1);
    .where('username' , '==' , req.body.username)
    const PostCommentsDocument = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostComments/${req.params.postCommentsId}`);
    let PostCommentsData;
    PostCommentsDocument.get().then(doc => {
        if(doc.exists){
            PostCommentsData = doc.data();
            PostCommentsData.postCommentsId = doc.id;
            return likeDocument.get(); 
        }else{
            return res.status(404).json({error: 'comment not found'});
        }
    })
    .then(data =>{
        if(data.empty){
            return db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostComments').doc(req.params.postCommentsId).collection('CommentsLike').add({
                
                postCommentsId: req.params.postCommentsId,
                username: req.body.username

                })
            .then(() =>{
                PostCommentsData.likeCount++
                return PostCommentsDocument.update({likeCount: PostCommentsData.likeCount });
            })
            
            .then(() =>{
                return res.json(PostCommentsData);
            });
        }else{
            return res.status(400).json({error: 'comment already Liked'});
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
});
exports.deleteCommentLike = ((req, res) => {
    const likeDocument = db.collection('Pages').doc(req.params.pagesId)
    .collection('PagePosts').doc(req.params.pagePostsId)
    .collection('PostComments').doc(req.params.postCommentsId)
    .collection('CommentsLike')
    .where('username' , '==' , req.body.username)
    const PostCommentDocument = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostComments/${req.params.postCommentsId}`);

    let PostCommentsData;
    PostCommentDocument.get().then(doc => {
        if(doc.exists){
            PostCommentsData = doc.data();
            PostCommentsData.postCommentsId = doc.id;
            return likeDocument.get(); 
        }else{
            return res.status(404).json({error: 'comment not found'});
        }
    })
    .then(data =>{
        if(data.empty){
            return res.status(400).json({error: 'comment not Liked'});
            
        }else{
            return db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostComments/${req.params.postCommentsId}/CommentsLike/${data.docs[0].id}`).delete().then(() =>{
                PostCommentsData.likeCount--;
                return PostCommentDocument.update({ likeCount: PostCommentsData.likeCount});
            })
            .then(() =>{
                res.json(PostCommentsData);
            })
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
    });