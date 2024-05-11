import { Router } from 'express';

import * as indexController from '../controllers/index.js';
import * as signUpController from '../controllers/signUp.js';
import * as logInController from '../controllers/logIn.js';
const router = Router();

//* GET HTTP HANDLERS

// index
router.get('/', indexController.index);
//sign up
router.get('/sign-up', signUpController.signUpGet);
//log in
router.get('/log-in', logInController.logInGet);
router.get('/log-in-failure', logInController.logInFailureGet);
// log out
router.get('/log-out', logInController.logOutGet);
//* POST HTTPS HANDLERS
//index
router.post('/', indexController.indexPost);
router.post('/:id/delete', indexController.commentDeletePost);
//sign up
router.post('/sign-up', signUpController.signUpPost);
// log in
router.post('/log-in', logInController.logInPost);

export default router;
