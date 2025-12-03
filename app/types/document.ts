export interface Document {
    id: string;
    filename: string;
    s3_url: string;
    user_id: string;
    created_at: string;
}

export interface UpdateDocumentDto {
    filename?: string;
    user_id?: string;
}
