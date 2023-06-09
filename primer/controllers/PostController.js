import PostModel from '../models/Post.js'

export const getLastTags = async(req,res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0,5);

        res.json(tags);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось получить теги',
        });
    }
}

export const getAll = async(req,res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось получить статьи',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = await PostModel.findOneAndUpdate( 
            {
                _id: req.params.id,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument : 'after',
            },    
        ).populate('user');

        res.json(postId);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось получить статьи',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = await PostModel.findOneAndDelete({
            _id: req.params.id,
            },
           /* (err,doc)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({
                    massage:'Не удалось удалить статью',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message:'Статья не найдена',
                    });  
                }

                res.json({
                    success:true,
                });

            },*/
        );

        res.json({
            success:true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось получить статьи',
        });
    }
};

export const create = async(req,res) => {
    try {
        const doc = new PostModel({            
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user:req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось создать статью',
        });
    }
};

export const update = async(req,res) => {
    try {

        const postId =  req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user:req.userId,
            tags: req.body.tags.split(','),
        });

        res.json({
            success:true,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            massage:'Не удалось обновить статью',
        });
    }
};