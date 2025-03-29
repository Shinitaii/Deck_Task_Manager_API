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
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * @return {Promise<void>} A JSON response containing the action.
     */
  public async confirmToken(req : Request, res : Response): Promise<void> {
    try {
      const {token} = req.body;

      if (!token) {
        res.status(400).json({success: false, message: "Token is required"});
        return;
      }

      const response = await this.authService.verifyToken(token);
      if (!response.success) {
        res.status(401).json(response);
        return;
      }

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in verifying firebase token.");
      }
    }
  }
}
