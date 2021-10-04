const Sauce = require('../models/sauce');
const fs = require('fs');
const { use } = require('../routes/sauce');

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ message: error.message }));
};

exports.modifySauce = (req, res) => {
  const sauceObject = req.file ? 
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ message: error.message }));
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ message: error.message }));
      })
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

exports.likeSauce = (req, res) => {
  const userId = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      
      const arrLike = sauce.usersLiked;
      const arrDislike = sauce.usersDisliked;

      switch(req.body.like) {
        case 1 :
          if (arrLike.includes(userId)){
            res.status(400).json({ message: 'User has already liked the sauce.'})
          } else if (arrDislike.includes(userId)){
            res.status(400).json({ message: 'User has already disliked the sauce.'})
          } else {
            arrLike.push(userId);
            sauce.likes = arrLike.length;
            sauce.save();
            console.log(sauce);
            res.status(200).json({ message: 'liked' });
          }
          break;
          
        case -1 :
          if (arrLike.includes(userId)){
            res.status(400).json({ message: 'User has already liked the sauce.'})
          } else if (arrDislike.includes(userId)){
            res.status(400).json({ message: 'User has already disliked the sauce.'})
          } else {
            arrDislike.push(userId);
            sauce.dislikes = arrDislike.length;
            sauce.save();
            console.log(sauce);
            res.status(200).json({ message: 'dislike' });
          }
        break;
        
        case 0 :
          if (arrLike.includes(userId)) {
            for (let i = 0; i < arrLike.length; i++) {
              if (arrLike[i] === userId) {
                arrLike.splice(i, 1);
                sauce.likes = arrLike.length;
              }
            }
          } else if (arrDislike.includes(userId)) {
            for (let i = 0; i < arrDislike.length; i++) {
              if (arrDislike[i] === userId) {
                arrDislike.splice(i, 1);
                sauce.dislikes = arrDislike.length;
              }
            }
          }
          sauce.save();
          console.log(sauce);
          res.status(200).json({ message: 'cancel' });
          break;

        default: 
          console.log('error'); 
          res.status(400).json({ message: 'Unknown input.' })
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
}

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        return res.status(200).json(sauce);
      })
      .catch(error => res.status(404).json({ message: error.message }));
};

exports.getSauce = (req, res) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ message: error.message }));
};