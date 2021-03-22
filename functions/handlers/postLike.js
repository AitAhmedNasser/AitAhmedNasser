const {db} = require('../util/admin');
exports.postPostLike = ((req, res)=>{
    const likeDocument = db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostLike')//.where('pagePostsId', '==' , req.params.pagePostsId).limit(1);
    .where('username' , '==' , req.body.username)
    const PagePostDocument = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`);
    let PagePostsData;
    PagePostDocument.get().then(doc => {
        if(doc.exists){
            PagePostsData = doc.data();
            PagePostsData.pagePostsId = doc.id;
            return likeDocument.get(); 
        }else{
            return res.status(404).json({error: 'post not found'});
        }
    })
    .then(data =>{
        if(data.empty){
            return db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostLike').add({
                pagePostsId: req.params.pagePostsId,
                username: req.body.username
            })
            .then(() =>{
                PagePostsData.likeCount++
                return PagePostDocument.update({likeCount: PagePostsData.likeCount });
            })
            .then(() =>{
                return res.json(PagePostsData);
            });
        }else{
            return res.status(400).json({error: 'Post already Liked'});
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
});
exports.deletePostlike =  ((req, res) => {

    const likeDocument = db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostLike').where('username' , '==' , req.body.username)
    //.where('pagePostsId', '==' , req.params.pagePostsId).limit(1);

    const PagePostDocument = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`);

    let PagePostsData;
    PagePostDocument.get().then(doc => {
        if(doc.exists){
            PagePostsData = doc.data();
            PagePostsData.pagePostsId = doc.id;
            return likeDocument.get(); 
        }else{
            return res.status(404).json({error: 'post not found'});
        }
    })
    .then(data =>{
        if(data.empty){
            return res.status(400).json({error: 'Post not Liked'});
            
        }else{
            return db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostLike/${data.docs[0].id}`).delete().then(() =>{
                PagePostsData.likeCount--;
                return PagePostDocument.update({ likeCount: PagePostsData.likeCount});
            })
            .then(() =>{
                res.json(PagePostsData);
            })
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
    });