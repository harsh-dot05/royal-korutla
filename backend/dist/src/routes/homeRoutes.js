"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homeController_1 = require("../controllers/homeController");
const router = (0, express_1.Router)();
router.get('/home', homeController_1.getHomepagePayload);
router.get('/categories', homeController_1.getCategories);
router.get('/stats', homeController_1.getStats);
exports.default = router;
