export enum ApprovalStatusType {
    Approved = 'Approved',
    Rejected = 'Rejected',
}

export type Invitation = {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    role: string;
    userLicenseType: string;
    fullname: string;
    userType: string;
    groups: string;
    userCreditAssignment: number;
    applyActUserDefaults: boolean;
};

export type GenericResponse = {
    status: string;
};
