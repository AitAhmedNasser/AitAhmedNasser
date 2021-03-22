const {db} = require('../util/admin');
exports.getallPagePost= ((req , res) => {
    db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').get()
    .then((data) =>{
         let PagePosts =[];
        data.forEach((doc) => {
        PagePosts.push(doc.data());  
        });
        return res.json(PagePosts);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });
exports.getPagePost = ( (req, res) => {
    let PagePostsData = {};
    db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`).get().then(doc =>{
        if(!doc.exists){
            return res.status(404).json({error: "La publication n'exist pas "})
        }
        PagePostsData = doc.data();
        PagePostsData.pagePostsId = doc.id;
        return db.collection('PostComments')
        .orderBy('createdAt','desc')
        .where('pagePostsId', '==' , req.params.pagePostsId).get();
    })
    .then(data =>{
        PagePostsData.PostComments =[];
        data.forEach((doc) => {
            PagePostsData.PostComments.push(doc.data());  
        });
        return res.json(PagePostsData);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: err.code} );
    })
    });
exports.postPagePost =((req, res)=>{
    if(req.body.body.trim() === ''){
        return res.status(400).json({body: 'Body must not be empty'});
    }
        const newPagePosts= {
            username : req.body.username,
            likeCount : 0,
            commentCount : 0,
            body : req.body.body,
            createdAt: new Date().toISOString()
        };
        db.doc(`/Pages/${req.params.pagesId}`).get().then((doc) =>{ 
            if(!doc.exists){
                return res.status(200).json({error: "la page n'existe pas "})
            }
           })
    .then(() =>{
        return db.collection('Pages').doc(req.params.pagesId).collection('PagePosts').add(newPagePosts)
    })
    .then(()=>{
        res.json(newPagePosts);
    })
        .catch(err => {
            res.status(500).json({error : '***Post Does Not Create***'});
            console.error(err); 
        })
    });
exports.putPagePost = ((req, res) => {
    const document = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`);
    document
    .get().then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: 'Post Not Found'});
        }
        else{
            return document.update({
                body : req.body.body
                 });
        }
    })
    .then(() => {
        res.json({message : 'Post updated Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error : err.code});
    });  
        });
exports.deletePagePost = ( (req, res) => {
    const document = db.doc(`/Pages/${req.params.pagesId}/PagePosts/${req.params.pagePostsId}`);
    document
    .get().then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: 'Post Not Found'});
        }
        else{
            return document.delete();
        }
    })
    .then(() => {
        res.json({message : 'Post Deleted Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error : err.code});
    });

});