"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reelRequestController_1 = require("../controllers/reelRequestController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Submit a reel request
router.post('/reel-requests', reelRequestController_1.createReelRequest);
// Admin: View and manage reel requests
router.get('/admin/reel-requests', auth_1.requireAdmin, reelRequestController_1.getReelRequests);
router.patch('/admin/reel-requests/:id', auth_1.requireAdmin, reelRequestController_1.updateReelRequest);
router.delete('/admin/reel-requests/:id', auth_1.requireAdmin, reelRequestController_1.deleteReelRequest);
exports.default = router;
