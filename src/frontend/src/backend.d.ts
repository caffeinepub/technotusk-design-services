import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    projectType: ProjectType;
    name: string;
    email: string;
    message: string;
}
export enum ProjectType {
    commercial = "commercial",
    other = "other",
    residential = "residential",
    industrial = "industrial"
}
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    getInquiryCount(): Promise<bigint>;
    submitInquiry(id: string, name: string, email: string, projectType: ProjectType, message: string): Promise<void>;
}
