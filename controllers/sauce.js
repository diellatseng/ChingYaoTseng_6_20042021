const Sauce = require('../models/sauce');
const fs = require('fs');

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
        // If input '1' is received (user clicks on like)
        case 1 :
          if (arrLike.includes(userId) || arrDislike.includes(userId)){                               // Returns an error if the user ID already exists in the list of liked/disliked users.
            res.status(400).json({ message: 'Error! User has already liked/disliked the sauce.'})
          } else {
            arrLike.push(userId);                                                                     // Adds user ID into the list of liked users.
            res.status(200).json({ message: "Aimé !" });
          }
        break;
          
        // If input '-1' is received (user clicks on dislike)
        case -1 :
            if (arrLike.includes(userId) || arrDislike.includes(userId)){                             // Returns an error if the user ID already exists in the list of liked/disliked users.
            res.status(400).json({ message: 'Error! User has already liked/disliked the sauce.'})
          } else {
            arrDislike.push(userId);                                                                  // Adds user ID into the list of disliked users.
            res.status(200).json({ message: "N'aime pas !" });
          }
        break;
            
        // If input '0' is received (user cancels like or dislike)
        case 0 :
          if (arrLike.includes(userId)) {
            for (let i = 0; i < arrLike.length; i++) {
              if (arrLike[i] === userId) {
                arrLike.splice(i, 1);
              }
            }
          } else if (arrDislike.includes(userId)) {
            for (let i = 0; i < arrDislike.length; i++) {
              if (arrDislike[i] === userId) {
                arrDislike.splice(i, 1);
              }
            }
          }
          res.status(200).json({ message: 'Annulé !' });
        break;

        // Returns an error if any input other than '1', '-1' or '0' is received.
        default: 
          console.log('error'); 
          res.status(400).json({ message: 'Error! Unknown input.' })
      }

      sauce.likes = arrLike.length;
      sauce.dislikes = arrDislike.length;
      sauce.save();
      console.log(sauce);

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