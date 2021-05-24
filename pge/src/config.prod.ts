// https://pspsportal.maps.arcgis.com/home/item.html?id=d4afc8cef0f84ef69b3202f54232728f#settings
export const appId = '6n0UweIWIVl1Xz3t';

export const approverGroupId = 'f91e67e04d364ce5be20a60b0dc27d05';

export const genericGroupId = 'e57e85195061401ea12478d9401d37c1';

export const groupsTableItemId = 'e5c1d7f3ee944cd2a27f333919df57a4';

export const requestAccessLayer = {
    url:
        'https://services6.arcgis.com/o8cuqyt0UuuW4fcP/arcgis/rest/services/service_329fee9d59e842ec817db4541e034cad/FeatureServer/0',
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
        organizationType: 'organization_type',
    },
    whereClause: 'approval_status IS NULL AND your_title IS NOT NULL',
};

export const parentPortalUrl = 'https://pgegisportal.maps.arcgis.com/';
export const childPortalUrl = 'https://pspsportal.maps.arcgis.com/';
export const webAppUrl = 'https://portalrequest.ss.pge.com';
export const portalLoginUrl = 'https://overview.pspsportal.pge.com/';

export const userDefaults = {
    role: 'RpHsnIyh5r06ui1Y',
    userLicenseType: 'creatorUT',
    userType: 'creatorUT',
    // Community Group
    childGroups: ['df6230668de6493b9aa9c0a7fc3ef02e'],
    parentGroups: [
        // Followers Group
        '3dd9cd916cc8461998c9dfa4b6daebe2',
        // PSPS Content Group
        '9f962e5e5aaf424ba62aad6f392812a9',
        // Generic Group
        'e57e85195061401ea12478d9401d37c1',
    ],
    userCreditAssignment: -1,
    applyActUserDefaults: false,
};
