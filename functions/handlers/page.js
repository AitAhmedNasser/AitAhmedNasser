const {db} = require('../util/admin');
const admin = require('firebase-admin');
exports.getallPage= ((req , res) => {
    db.collection('Pages').get()
    .then((data) =>{
         let pages =[];
        data.forEach((doc) => {
            pages.push(doc.data());  
        });
        return res.json(pages);
    })
    .catch(err =>{
        console.error(err);
        res.status(500).json({error: "something went wrong"});
    })
    });
exports.getPages = (async (req, res) => {
    try{
        let document = db.collection('Pages').doc(req.params.pagesId);
        let page = await document.get();
        if(page.exists){
                let response = page.data();
                return res.status(200).send(response);
           }
            else
           {
                return res.json({message: 'page not found'});
            }
        
    }
     catch(error){
         console.log(error);
         res.status(500).json({error: 'something went wrong'});
            
     }
    });
exports.postPages = ((req, res)=>{
        const newPages = {
            pageName: req.body.pageName,
            owner: req.body.owner,
            likeCount: 0,
            createdAt: admin.firestore.Timestamp.fromDate(new Date())
        };
        db.collection('Pages').add(newPages)
    .then(doc => {
        newPages.PageId = doc.id;
        res.json(newPages);
    })
    .catch(err => {
        res.status(500).json({message : 'Page non cree'});
        console.error(err); 
    })
    });
exports.putPages= ((req, res) => {
    const document = db.doc(`/Pages/${req.params.pagesId}`);
    document
    .get().then((doc) => {
        if(!doc.exists){
            return res.status(404).json({error: 'Page Not Found'});
        }
        else{
            return document.update({
                pageName : req.body.pageName
                 });
        }
    })
    .then(() => {
        res.json({message : 'page updated Successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error : err.code});
    });  
        });
        
exports.deletePages = ( (req, res) => {
    const pageId = req.params.pagesId
    db.collection('Pages').doc(pageId)
    .get()
    .then((doc) =>{
        if(doc.exists){
            doc.ref.delete()
            .then(()=> {
                res.status(200).json({message: 'page successfully deleted'});
            })
        }
        else{
            res.status(200).json({message : 'page not faund'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Something went wrong'});
    })
});
