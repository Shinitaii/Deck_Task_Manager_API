import {ApiError} from "../helper/apiError";
import {FirebaseAdmin} from "../config/firebaseAdmin";
import {TaskFolder} from "../models/TaskFolder";

/**
 * Responsible for handling Task Folder logic
 * @extends FirebaseAdmin
 */
export class TaskFolderRepository extends FirebaseAdmin {
  /**
   * Gets all the task folders from the user.
   * @param {userId} userId - UID of the user
   * @return {Promise<FirebaseFirestore.DocumentData[] | null>}
   * Returns an array of task folders from the user.
   */
  public async getTaskFoldersByUserId(userId: string)
  : Promise<FirebaseFirestore.DocumentData[] | null> {
    const db = this.getDb();

    const taskFolderSnap = await db.collection("task_folders").doc(userId)
      .collection("folders").get();
    if (taskFolderSnap.empty) return null;

    return taskFolderSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * Gets a specific task folder from the user with its ID.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @return {Promise<FirebaseFirestore.DocumentData | null | undefined>}
   * Returns found task.
   */
  public async getTaskFolderByTaskFolderId(
    userId: string, taskFolderId: string)
  : Promise<FirebaseFirestore.DocumentData | null | undefined> {
    const db = this.getDb();

    const taskFolderDoc = await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).get();
    return taskFolderDoc.exists ? taskFolderDoc.data() : null;
  }

  /**
 * Creates a task folder for the user and returns the created folder with its ID.
 * @param {string} userId - UID of the user.
 * @param {TaskFolder} taskFolder - Task Folder details.
 * @returns {Promise<object>} - The created task folder data with its generated ID.
 */
  public async createTaskFolder(
    userId: string, taskFolder: TaskFolder
  ): Promise<object> {
    try {
      const db = this.getDb();
      const folderRef = await db
        .collection("task_folders")
        .doc(userId)
        .collection("folders")
        .add(taskFolder);

      // Retrieve the newly created document
      const snapshot = await folderRef.get();

      if (!snapshot.exists) {
        throw new ApiError(
          "Failed to create task folder. Please try again later.",
          400,
        );
      }

      const createdFolder = snapshot.data();

      // Return the folder data including the generated ID
      return {
        new_task_folder: {
          id: folderRef.id,
          ...createdFolder,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error; // Re-throw ApiError to be handled by the caller
      } else {
        throw new ApiError(
          "An error occurred while creating the task folder: " + error,
          500,
        );
      }
    }
  }


  /**
   * Updates a task folder on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @param {taskFolder} taskFolder - Updated task folder details.
   */
  public async updateTaskFolder(
    userId: string, taskFolderId: string, taskFolder: Partial<TaskFolder>
  ): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).update(taskFolder);
  }

  /**
   * Deletes a task folder on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   */
  public async deleteTaskFolder(
    userId: string, taskFolderId: string): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).delete();
  }
}
