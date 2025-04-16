/**
 * This interface serves as a custom-built
 * response specifically for handling
 * three layers in this project.
 */
export interface BaseResponse {
    success: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: any,
}
