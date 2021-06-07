// https://sce-psportal.maps.arcgis.com/home/item.html?id=018785c264cd4b0fa874f75fadc735c4#settings
export const appId = 'KjKLJ1trY7Ii4Wvl';

// https://sce-psportal.maps.arcgis.com/home/group.html?id=160ba304f4df410cae24e9db4b40cb3f#overview
export const approverGroupId = '160ba304f4df410cae24e9db4b40cb3f';

// https://sce-psportal.maps.arcgis.com/home/group.html?id=8eaab1aee100453a971c207918456bd2#overview
export const genericGroupId = '8eaab1aee100453a971c207918456bd2';

// https://sce-psportal.maps.arcgis.com/home/item.html?id=03b2772f5ab3416984afca6c92f36620
export const groupsTableItemId = '03b2772f5ab3416984afca6c92f36620';

// https://sce-psportal.maps.arcgis.com/home/item.html?id=ca00ed0df7eb4bc7acf1a043bc9a4bd5#data
export const requestAccessLayer = {
    url: 'https://services3.arcgis.com/xmPYozdyNDmkc79k/arcgis/rest/services/Prod_Public_Safety_Portal_Request_Access_View/FeatureServer/0',
    fieldNames: {
        objectid: 'objectid',
        globalid: 'globalid',
        approvalStatusEditDate: 'approval_status_edit_date',
        approvalStatus: 'approval_status',
        firstName: 'first_name',
        lastName: 'last_name',
        username: 'username',
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

export const parentPortalUrl = 'https://sce.maps.arcgis.com/';
export const childPortalUrl = 'https://sce-psportal.maps.arcgis.com/';
export const webAppUrl = 'https://localhost:8080/';
export const portalLoginUrl = 'https://overview.publicsafetyportal.sce.com/';

export const userDefaults = {
    role: 'Wa3n0U2AgluHhkcC',
    userLicenseType: 'creatorUT',
    userType: 'arcgisonly',
    childGroups: ['4df8f05100c7487eaec64ce6ae3d7429'],
    parentGroups: [
        '8eaab1aee100453a971c207918456bd2',
        '1688d32c9bc6406ba8b14b0ec053b980',
        '95496f32309a44a5bbed142793cfacaa',
    ],
    userCreditAssignment: -1,
    applyActUserDefaults: false,
};
