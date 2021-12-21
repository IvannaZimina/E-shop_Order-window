const express = require('express');
const { serverData } = require('../model/model.js');
const router = express.Router();

router.get('/server', (req, res) => {
   res.json(serverData);
});

router.get('/', (req, res) => {
    res.render('index', {title: 'Items', active: 'main'});
})

router.get('/notes', (req, res) => {
    res.render('notes', {title: 'Notes', active: 'notes'});
})

module.exports = router;
