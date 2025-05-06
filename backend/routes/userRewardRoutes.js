const express = require('express');
const router = express.Router();
const userRewardController = require('../controllers/userRewardController');

router.post('/', userRewardController.createUserReward);
router.get('/:id', userRewardController.getUserRewardByUserId);
router.delete('/:id', userRewardController.deleteUserReward);

module.exports = router;
