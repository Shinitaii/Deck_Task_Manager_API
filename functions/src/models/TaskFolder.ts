import {Timestamp} from "firebase-admin/firestore";

/**
 * An interface for the Task Folder.
 */
export interface NewTaskFolder {
    title: string,
    background: string,
    timestamp: Timestamp,
    is_deleted: boolean,
}

export interface TaskFolder extends NewTaskFolder {
  user_id: string;
}
