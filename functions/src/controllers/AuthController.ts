import {Request, Response} from "express";
import {AuthService} from "../services/AuthService";

/**
 * This class is responsible for managing auth services.
 */
export class AuthController {
  /**
   * Service responsible for handling authentication operations.
   */
  private authService : AuthService;
  /**
   * Initializes the class with AuthService
   * @param {authService} authService
   */
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
     * Handles the verification of the Firebase ID Token
     * and obtains the user details from Firebase
     * Authentication.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @return {Promise<void>} A JSON response containing the
     * decoded token, the UID of the user and its details
     * from Firebase Authentication.
     */
  public async confirmToken(req : Request, res : Response): Promise<void> {
    try {
      const {token} = req.body;

      if (!token) {
        res.status(400).json({success: false, message: "Token is required"});
        return;
      }

      const verifiedToken = await this.authService.verifyToken(token);
      if (!verifiedToken.success || !verifiedToken.message.uid) {
        res.status(401).json("Unable to verify token.");
        return;
      }

      const userDetails = await this.authService.getUser(
        verifiedToken.message.uid);
      if (!userDetails) {
        res.status(401).json("Unable to find user.");
        return;
      }

      res.status(200).json({verifiedToken, userDetails});
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in verifying firebase token.");
      }
    }
  }

  /**
   * Updates user name after creating account.
   * @param {req} req
   * @param {res} res
   */
  public async updateAccountName(req: Request, res: Response): Promise<void> {
    try {
      const {uid, name} = req.body;
      const update = await this.authService.updateUser(uid,
        {displayName: name});
      if (!update) {
        res.status(401).json("Unable to update user's name");
      }

      res.status(200).json("Successfully updated user name");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occured in updating account name.");
      }
    }
  }
}
