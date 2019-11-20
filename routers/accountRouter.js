const express = require('express');

const db = require('../data/dbConfig.js');
const router = express.Router();

router.get('/', (req, res) => {
    req.query = {
        limit:'10',
        sortby: 'id',
        sortdir: 'desc'
    }
   
    db.select('*')
      .from('accounts')
      
      .limit(req.query.limit)
      .orderBy(req.query.sortby, req.query.sortdir)

      .then(accounts => {
          res.status(200).json(accounts);
      })
      .catch(err => {
          res.status(500).json(err);
      })
});

router.get('/:id', (req, res) => {
    db.select('*')
   
      .from('accounts')
      .where('id', '=', req.params.id)
      .first()
      .then(post => {
          res.status(200).json(post);
      })
      .catch(err => {
          res.status(500).json(err);
      })
})

router.post('/', validateAccount, (req, res) => {
    const accountData = req.body;
    
    db('accounts')
      .insert(accountData, 'id')
      .then(ids => {
          res.status(200).json(ids);
      })
      .catch(err => {
          res.status(500).json(err);
      })

});

router.put('/:id', validateAccount, (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .update(req.body)
      .then (account => {
          res.status(200).json(account);
      })
      .catch(err => {
          res.status(500).json(err);
      })
});

router.delete('/:id', (req, res) => {
    db('accounts')
      .where({ id: req.params.id })
      .del()
      .then(account => {
          res.status(200).json(account);
      })
      .catch(err => {
          res.status(500).json(err);
      })
});

function validateAccount (req, res, next) {
    const account = req.body;
    if (!Object.keys(account).length) {
        res.status(400).json({ message: 'no account info sent'});
    } else if (!account.name || !account.budget) {
        res.status(400).json({ message: 'Name and Budget are required'});
    } else {
        next();
    }
}

module.exports = router;