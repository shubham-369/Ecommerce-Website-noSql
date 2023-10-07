const express = require('express');
const router = express.Router();

router.use((req, res)=> {
    res.status(404).render('shop/404-error', { pageTitle: 'Page Not Found' });
});

module.exports = router;