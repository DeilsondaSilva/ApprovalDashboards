// https://scetest-psportal.maps.arcgis.com/home/item.html?id=15484086ad20495e8a9b0035bd6ad8f6#settings
export const appId = 'eecL6xGiImSr3UXE';

// https://scetest-psportal.maps.arcgis.com/home/group.html?id=75856f42e0634fc0806f5c1e5e140231#overview
export const approverGroupId = '75856f42e0634fc0806f5c1e5e140231';

// https://scetest.maps.arcgis.com/home/group.html?id=6096a67e52e345cba1483a8ed30ab5cb#overview
export const genericGroupId = '6096a67e52e345cba1483a8ed30ab5cb';

// https://scetest.maps.arcgis.com/home/item.html?id=46f691c47e1a4d72861fac4f64a5a28d
export const groupsTableItemId = 'df1bc12812134c4eba3c40ea014c5565';

// https://scetest.maps.arcgis.com/home/item.html?id=d13ee7a039fb41749415c849d8087c58
export const requestAccessLayer = {
    url: 'https://services3.arcgis.com/nk0ZWDI3lXr0vAXe/ArcGIS/rest/services/RequestAccess_View/FeatureServer/0',
    fieldNames: {
        objectid: 'objectid',
        globalid: 'globalid',
        approvalStatusEditDate: 'approval_status_edit_date',
        approvalStatus: 'approval_status',
        firstName: 'first_name',
        lastName: 'last_name',
        organizationName: 'organization_name',
        creationDate: 'CreationDate',
        editDate: 'EditDate',
        title: 'your_title',
        phoneNumber: 'work_phone_number',
        email: 'work_email_address',
        agreeToTermsAndConditions: 'select_one',
        agencyType: 'agency_type',
        MFAOptin: 'MFA_OptIn',
    },
    whereClause: 'approval_status IS NULL AND your_title IS NOT NULL',
};

export const parentPortalUrl = 'https://scetest.maps.arcgis.com/';
export const childPortalUrl = 'https://scetest-psportal.maps.arcgis.com/';
export const webAppUrl = 'https://localhost:8080/';
export const portalLoginUrl = 'https://overview.publicsafetyportaltest.sce.com/';

export const userDefaults = {
    role: 'Mwpmp1BUH8gVCOj7',
    userLicenseType: 'creatorUT',
    userType: 'arcgisonly',
    childGroups: ['7c7a8dab758141049cf02f87d79a2100'],
    parentGroups: [
        '6096a67e52e345cba1483a8ed30ab5cb',
        '1688d32c9bc6406ba8b14b0ec053b980',
        '95496f32309a44a5bbed142793cfacaa',
    ],
    userCreditAssignment: -1,
    applyActUserDefaults: false,
};
