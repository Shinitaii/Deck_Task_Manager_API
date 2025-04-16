import {Timestamp} from "firebase-admin/firestore";

/**
 * An interface for the Task Folder.
 */
export interface TaskFolder {
    user_id: string,
    title: string,
    description: string,
    timestamp: Timestamp,
    is_deleted: boolean,
}
