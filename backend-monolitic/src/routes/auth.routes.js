const express = require('express'); 
const router = express.Router(); 


router.post('/register', (req, res) => {
    res.send('Register routes');
}); 

router.post('/login', (req, res) => {
    res.send('Login Routes')
});

router.get('/logout', (req, res) => {
    res.send('logout routes')
});

router.get('/refresh-token', (req, res) => {
    res.send('Refresh Token routes')
});

router.get('/forgot-password', (req, res)=> {
    res.send('Forgot Password routes')
});

router.get('/reset-password', (req, res) => {
    res.send('Reset Password Routes')
}); 

router.get('/verify-email', (req, res) => {
    res.send('Verify Email Routes');
});

router.get('/resend-verification', (req, res)=> {
    res.send('Resend Verification Routes')
})

module.exports = router;