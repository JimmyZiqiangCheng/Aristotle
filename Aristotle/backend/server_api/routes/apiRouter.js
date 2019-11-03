var express = require('express');
var router = express.Router();

// Joi schema for validaton
const joiSchema = require('./../middleware/validationSchema');
const validate = require('../middleware/validator');

const roleCtrl = require('../controllers/roleControllers');
const userTypeCtrl = require('../controllers/userTypeController');
const departmentCtrl = require('../controllers/departmentController');

router.post('/role', roleCtrl.create_role);
router.get('/roles', roleCtrl.get_all_roles);

router.post('/department', departmentCtrl.create_department);
router.get('/departments', departmentCtrl.get_all_departments);

router.post('/type', userTypeCtrl.create_user_type);
router.get('/types', userTypeCtrl.get_all_user_types);

module.exports = router;