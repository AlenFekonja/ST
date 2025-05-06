const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');

router.post('/', rewardController.createReward);
router.get('/', rewardController.getRewards);
router.get('/:id', rewardController.getRewardById);
router.put('/:id', rewardController.updateReward);
router.delete('/:id', rewardController.deleteReward);

module.exports = router;
