const express = require('express')
const router = new express.Router()
 
router.get('/user', async(req, res) => {
 
    try {
        res.status(201).send("The Server is Working!")
    } catch (error) {
        res.status(400).send("Error")
    }
})
 
module.exports = router