import {Router, Request, Response} from "express";
import {AuthController} from "../controllers/AuthController";
import {AuthService} from "../services/AuthService";
import {AuthRepository} from "../repositories/AuthRepository";
import {UserController} from "../controllers/UserController";
import {UserService} from "../services/UserService";
import {UserRepository} from "../repositories/UserRepository";
// eslint-disable-next-line new-cap
const router = Router();
const authController = new AuthController(
  new AuthService(
    new AuthRepository()));
const userController = new UserController(
  new UserService(
    new UserRepository()));

/**
 *
 * @route POST api/v1/auth/verify_token
 * @description Verifies the Firebase ID Token sent from the website.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/verify-token", async (req: Request, res: Response) => {
  await authController.confirmToken(req, res);
});

/**
 * @route POST api/vi/auth/create-account
 * @description Creates an account in the Firebase Authentication
 * and Firestore.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/create-account", async (req : Request, res: Response) => {
  await userController.createUser(req, res);
  await authController.updateAccountName(req, res);
});

export default router;
