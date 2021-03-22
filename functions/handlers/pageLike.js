const {db} = require('../util/admin');
    exports.getPageLike= ((req , res) => {
        db.collection('Pages').doc(req.params.pagesId).collection('PageLike').get()
        .then((data) =>{
             let PageLike =[];
            data.forEach((doc) => {
                PageLike.push(doc.data());  
            });
            return res.json(PageLike);
        })
        .catch(err =>{
            console.error(err);
            res.status(500).json({error: "something went wrong"});
        })
        });
    

    exports.postPageLike= ((req, res)=>{
        const newpagelike ={
            PagesId: req.params.pagesId,
            username: req.body.username,
            creatAt: new Date().toISOString() 
        }
        const likePage = db.collection('Pages').doc(req.params.pagesId).collection('PageLike').where('username' , '==' , req.body.username)
        const PagesDocument = db.doc(`/Pages/${req.params.pagesId}`);
        let PagesData;
        PagesDocument.get().then(doc => {
            if(doc.exists){
                PagesData = doc.data();
                PagesData.pagesId = doc.id;
                return likePage.get(); 
            }else{
                return res.status(404).json({error: 'page not found'});
            }
        })
        .then(data =>{
            if(data.empty){
                return db.collection('Pages').doc(req.params.pagesId).collection('PageLike').add(newpagelike)
                .then((doc) => {
                        newpagelike.PageLikeId = doc.id;
                        res.status(200).send(newpagelike);
                      })
                .then(() =>{
                    PagesData.likeCount++
                    return PagesDocument.update({likeCount: PagesData.likeCount });
                })
                
                .then(() =>{
                    return res.json(PagesData);
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

exports.deletePageLike = ( (req, res) => {

    const likeDocument = db.collection('Pages').doc(req.params.pagesId).collection('PageLike').where('username' , '==' , req.body.username)
    const PagesDocument = db.doc(`/Pages/${req.params.pagesId}`);

    let PagesData;
    PagesDocument.get().then(doc => {
        if(doc.exists){
            PagesData = doc.data();
            PagesData.pagesId = doc.id;
            return likeDocument.get(); 
        }else{
            return res.status(404).json({error: 'page not found'});
        }
    })
    .then(data =>{
        if(data.empty){
            return res.status(400).json({error: 'page not Liked'});
            
        }else{
            return db.doc(`/Pages/${req.params.pagesId}/PageLike/${data.docs[0].id}`).delete().then(() =>{
                PagesData.likeCount--;
                return PagesDocument.update({ likeCount: PagesData.likeCount});
            })
            .then(() =>{
                res.json(PagesData);
            })
        }
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).json({error: err.code});
    })
    });
    
  