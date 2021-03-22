const {db} = require('../util/admin');
exports.getallpostcomment= ((req , res) => {
    db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostComments').get()
    .then((data) =>{
         let PostComments =[];
        data.forEach((doc) => {
        PostComments.push(doc.data());  
        });
        return res.json(PostComments);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });
    exports.postPostComment = ((req, res) => {
        if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must Not Be empty'});
        const newPostComments = {
            username : req.body.username,
            likeCount: 0,
            body: req.body.body,
            creatAt: new Date().toISOString()  
        };
        db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`).get().then((doc) =>{ 
            if(!doc.exists){
                return res.status(404).json({error: "La publication n'exist pas "})
            }
           return doc.ref.update({ commentCount: doc.data().commentCount + 1});
    })
    .then(() =>{
        return db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').doc(req.params.pagePostsId).collection('PostComments').add(newPostComments);
    })
    .then(() =>{
        res.json(newPostComments);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Somthing Went Wrong'});
    })
        });
    
exports.putPostComment = ((req, res) => {
    const document = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostComments/${req.params.postCommentsId}`);
    document
    .get().then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: 'comment Not Found'});
        }
        else{
            return document.update({
                body : req.body.body
                 });
        }
    })
    .then(() => {
        res.json({message : 'comment updated Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error : err.code});
    });  
    });
exports.deletePostComment = ((req, res) => {
    const PagePostDocument = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`);
    let PagePostsData;
    PagePostDocument.get().then(doc => {
         PagePostsData = doc.data();
         PagePostsData.pagePostsId = doc.id;
    })
    const document = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}/PostComments/${req.params.postCommentsId}`);
    document
    .get().then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: 'comment Not Found'});
        }
        else{
            return document.delete().then(() =>{
                PagePostsData.commentCount--;
                return PagePostDocument.update({ commentCount: PagePostsData.commentCount});
            })
            
        }
    })
    .then(() => {
        res.json({message : 'comment Deleted Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error : err.code});
    });
            });