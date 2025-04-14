import {AuthRepository} from "../repositories/AuthRepository";
import {BaseResponse} from "../models/BaseResponse";
import {UpdateRequest, UserRecord} from "firebase-admin/auth";
/**
 * Service class responsible for handling auth-related operations
 */
export class AuthService {
  private authRepository : AuthRepository;
  /**
   * Initializes the class with AuthRepository
   * @param {authRepository} authRepository
   */
  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  /**
   * Verifies the token of the user.
   * @param {idToken} idToken - Firebase Token of the user.
   * @return {Promise<BaseResponse>} JSON Response that
   * contains the decoded token and UID of the user.
   */
  public async verifyToken(idToken: string): Promise<BaseResponse> {
    try {
      const decodedToken = await this.authRepository.decodeToken(idToken);
      const uid = decodedToken.uid;
      return {success: true, message: {decodedToken, uid}};
    } catch (error) {
      return {success: false, message: error};
    }
  }

  /**
   * Sends a password reset link to the user.
   * @param {email} email - Email of the user
   * @return {Promise<string>} A generated link for the user.
   */
  public async forgetPass(email: string): Promise<string> {
    return await this.authRepository.forgotPass(email);
  }

  /**
   * Gets the user from Firebase Authentication
   * @param {userId} userId - UID of the user.
   * @return {Promise<UserRecord>} A promise containing
   * the user details.
   */
  public async getUser(userId: string): Promise<UserRecord> {
    return await this.authRepository.getUser(userId);
  }

  /**
   * Updates a user in the Firebase Authentication
   * @param {uid} uid - UID of the user
   * @param {data} data - New details of the user
   * @return {Promise<UserRecord>} - JSON Response
   * containing the new user details.
   */
  public async updateUser(uid: string, data: UpdateRequest)
  : Promise<UserRecord> {
    return await this.authRepository.updateUser(uid, data);
  }
}
