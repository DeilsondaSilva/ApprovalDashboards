// https://pge-psps-portal.maps.arcgis.com/home/item.html?id=15484086ad20495e8a9b0035bd6ad8f6#settings
export const appId = 'X8Vht4uOsKYYVdEC';

// https://pge-psps-portal.maps.arcgis.com/home/group.html?id=ce02f7029a804b79beee3e03a3fbcb49#overview
export const approverGroupId = 'ce02f7029a804b79beee3e03a3fbcb49';

// https://geomartawrrqa.maps.arcgis.com/home/group.html?id=e6569d81a8bf464aae2b44b0b5cab1de#overview
export const genericGroupId = 'e6569d81a8bf464aae2b44b0b5cab1de';

// https://geomartawrrqa.maps.arcgis.com/home/item.html?id=46f691c47e1a4d72861fac4f64a5a28d
export const groupsTableItemId = '46f691c47e1a4d72861fac4f64a5a28d';

// https://geomartawrrqa.maps.arcgis.com/home/item.html?id=d13ee7a039fb41749415c849d8087c58
export const requestAccessLayer = {
    url:
        'https://services.arcgis.com/l5ho40vpsThFdzcg/arcgis/rest/services/survey123_3831c70b2bcd4d759fee84fc55fe5f1c/FeatureServer/0',
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

export const parentPortalUrl = 'https://geomartawrrqa.maps.arcgis.com';
export const childPortalUrl = 'https://pge-psps-portal.maps.arcgis.com';
export const webAppUrl = 'https://portalrequestdev.nonprod.pge.com';
export const portalLoginUrl = 'https://overview.pspsportalqa.pge.com/';

export const userDefaults = {
    role: 'E2kSKSFYWnQ1lMA0',
    userLicenseType: 'creatorUT',
    userType: 'arcgisonly',
    childGroups: ['f64837df711d4825bfe8e39880a97e40'],
    parentGroups: [
        'fd2a565827884ac3a2443ab44f7ea8f0',
        '4bf3a93f575e4c6cb515393cfc0cfb20',
        'e6569d81a8bf464aae2b44b0b5cab1de',
    ],
    userCreditAssignment: -1,
    applyActUserDefaults: false,
};
