import React from 'react';
import { Tag } from 'antd';
import { requestAccessLayer, userDefaults } from '../config';
import { Invitation } from '../types/types';

const {
    fieldNames: {
        firstName,
        lastName,
        email,
        objectid,
        globalid,
        organizationName,
        creationDate,
        title,
        pgeportaltypes,
        phoneNumber,
        agreeToTermsAndConditions,
        organizationType,
    },
} = requestAccessLayer;

const { role, userLicenseType, userType, childGroups, userCreditAssignment, applyActUserDefaults } = userDefaults;

const createEmailMessage = (invitation: Invitation) => {
    switch (invitation.pgeportaltypes) {
        case 'PSPS_Portal_only':
            return `
            <div>
            <p>Hello,</p>
            <p>Your account to access Southern California Edison’s (SCE) Public Safet Portal has been created. Below are your account login credentials:</p>
            <p><span><b>Portal Login URL: </b><a href="https://overview.publicsafetyportaltest.sce.com/">PSPS Public Safety Portal</a><br></span><span><b>Username :</b>${invitation.username}<br></span><span><b>Temporary Password* :</b> ${invitation.password}<br></span><span>*Please note your temporary password will expire in 14 days</span></p>
            <p><u>First-time Login Instructions:</u></p>
            <ol>
            <li><span>Navigate your browser to the Portal Login URL </span><a href="https://pspspartnerportal.sce.com/">https://pspspartnerportal.sce.com/</a><a href="https://pspspartnerportal.sce.com/"></a></li>
            <li>Click the ‘Sign In’ button</li>
            <li>Choose ArcGIS login to enter in your newly created credentials</li>
            <ul>
                <li>Note: The first login will force a password reset
            </ul>
            <li>Click Approve</li>
            </ol>
            <p><b>We strongly encourage you to log in to your account at your earliest convenience to change your password and familiarize yourself with the Public Safety Portal.&nbsp;</b></p>
            <p>Attached for your reference is a quick start guide on how to log in and navigate through the portal for planning and event-specific information. If you have questions or need technical assistance, please email <a href ="mailto:publicsafetyportal@sce.com">publicsafetyportal@sce.com</a></p>
            Thank you again for your interest in our Public Safety Power Shutoff Program and our efforts to reduce wildfire risks and keep our customers and communities safe.
            <p>Sincerely,<br>SCE PSPS Portal Team</p>
        </div>
            `;

        case 'Microgrid_Portal_only':
            return `<div>
            <p>Hello,</p>
            <p>Your account to access PGE Microgrid Portal has been created. Below are your account login credentials:</p>
            <p><span><b>Portal Login URL: </b><a href="https://overview.microgridportalqa.pge.com/">Microgrid Portal</a><br></span><span><b>Username :</b> ${invitation.username}<br></span><span><b>Temporary Password* :</b> ${invitation.password}<br></span><span>*Please note your temporary password will expire in 14 days</span></p>
            <p><u>First-time Login Instructions:</u></p>
            <ol>
            <li><span>Navigate your browser to the Portal Login URL </span><a href="https://overview.microgridportalqa.pge.com/">https://overview.microgridportalqa.pge.com/</a><a href="https://overview.microgridportalqa.pge.com/"></a></li>
            <li>Click the ‘Sign In’ button</li>
            <li>Choose ArcGIS login to enter in your newly created credentials</li>
            <ul>
                <li>Note: The first login will force a password reset
            </ul>
            <li>Click Approve</li>
            </ol>
            <p><b>We strongly encourage you to log in to your account at your earliest convenience to change your password and familiarize yourself with the Microgrid Portal.&nbsp;</b></p>
            <p>Attached for your reference is a quick start guide on how to log in and navigate through the portal for planning and event-specific information. If you have questions or need technical assistance, please send an email to <b>MicrogridPortal@pge.com</b></p>
            Thank you again for your interest in our Public Safety Power Shutoff Program and our efforts to reduce wildfire risks and keep our customers and communities safe.
            <p>Sincerely,<br>PGE Microgrid Team</p>
        </div>
            `;
        case 'Both_PG&E_Portals':
            return `
            <div>
            <p>Hello,</p>
            <p>Your account to access Southern California Edison’s (SCE) Public Safet Portal has been created. Below are your account login credentials:</p>
            <p><span><b>Portal Login URL: </b><a href="https://overview.publicsafetyportaltest.sce.com/">PSPS Public Safety Portal</a><br></span><span><b>Username :</b>${invitation.username}<br></span><span><b>Temporary Password* :</b> ${invitation.password}<br></span><span>*Please note your temporary password will expire in 14 days</span></p>
            <p><u>First-time Login Instructions:</u></p>
            <ol>
            <li><span>Navigate your browser to the Portal Login URL </span><a href="https://pspspartnerportal.sce.com/">https://pspspartnerportal.sce.com/</a><a href="https://pspspartnerportal.sce.com/"></a></li>
            <li>Click the ‘Sign In’ button</li>
            <li>Choose ArcGIS login to enter in your newly created credentials</li>
            <ul>
                <li>Note: The first login will force a password reset
            </ul>
            <li>Click Approve</li>
            </ol>
            <p><b>We strongly encourage you to log in to your account at your earliest convenience to change your password and familiarize yourself with the Public Safety Portal.&nbsp;</b></p>
            <p>Attached for your reference is a quick start guide on how to log in and navigate through the portal for planning and event-specific information. If you have questions or need technical assistance, please email <a href ="mailto:publicsafetyportal@sce.com">publicsafetyportal@sce.com</a></p>
            Thank you again for your interest in our Public Safety Power Shutoff Program and our efforts to reduce wildfire risks and keep our customers and communities safe.
            <p>Sincerely,<br>SCE PSPS Portal Team</p>
        </div>
            `;
        default:
            return `
            <div>
            <p>Hello,</p>
            <p>Your account to access Southern California Edison’s (SCE) Public Safet Portal has been created. Below are your account login credentials:</p>
            <p><span><b>Portal Login URL: </b><a href="https://overview.publicsafetyportaltest.sce.com/">PSPS Public Safety Portal</a><br></span><span><b>Username :</b>${invitation.username}<br></span><span><b>Temporary Password* :</b> ${invitation.password}<br></span><span>*Please note your temporary password will expire in 14 days</span></p>
            <p><u>First-time Login Instructions:</u></p>
            <ol>
            <li><span>Navigate your browser to the Portal Login URL </span><a href="https://pspspartnerportal.sce.com/">https://pspspartnerportal.sce.com/</a><a href="https://pspspartnerportal.sce.com/"></a></li>
            <li>Click the ‘Sign In’ button</li>
            <li>Choose ArcGIS login to enter in your newly created credentials</li>
            <ul>
                <li>Note: The first login will force a password reset
            </ul>
            <li>Click Approve</li>
            </ol>
            <p><b>We strongly encourage you to log in to your account at your earliest convenience to change your password and familiarize yourself with the Public Safety Portal.&nbsp;</b></p>
            <p>Attached for your reference is a quick start guide on how to log in and navigate through the portal for planning and event-specific information. If you have questions or need technical assistance, please email <a href ="mailto:publicsafetyportal@sce.com">publicsafetyportal@sce.com</a></p>
            Thank you again for your interest in our Public Safety Power Shutoff Program and our efforts to reduce wildfire risks and keep our customers and communities safe.
            <p>Sincerely,<br>SCE PSPS Portal Team</p>
        </div>
            `;
    }
};

const shuffleArray = (array: string[]) => {
    let jdx: number;
    let temp: string;

    for (let idx = array.length - 1; idx > 0; idx--) {
        jdx = Math.floor(Math.random() * (idx + 1));
        temp = array[idx];
        array[idx] = array[jdx];
        array[jdx] = temp;
    }

    return array;
};

const generateOneTimePassword = (passwordLength: number) => {
    const NUMBER_CHARS = '0123456789';
    const UPPER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWER_CHARS = 'abcdefghijklmnopqrstuvwxyz';
    const SYMBOL_CHARS = '!#$%&()*?@[]';
    const ALL_CHARS = NUMBER_CHARS + UPPER_CHARS + LOWER_CHARS + SYMBOL_CHARS;
    let randPasswordArray = Array(passwordLength);

    randPasswordArray[0] = NUMBER_CHARS;
    randPasswordArray[1] = UPPER_CHARS;
    randPasswordArray[2] = LOWER_CHARS;
    randPasswordArray[3] = SYMBOL_CHARS;

    randPasswordArray = randPasswordArray.fill(ALL_CHARS, 3);
    return shuffleArray(
        randPasswordArray.map(function(x) {
            return x[Math.floor(Math.random() * x.length)];
        }),
    ).join('');
};

const createInvitation = (user: any): Invitation => {
    return {
        email: user[email],
        firstname: user[firstName],
        lastname: user[lastName],
        password: generateOneTimePassword(12),
        role,
        userLicenseType,
        fullname: `${user[firstName]} ${user[lastName]}`,
        userType,
        groups: childGroups.join(','),
        userCreditAssignment,
        applyActUserDefaults,
        username: user[email],
        pgeportaltypes: user[pgeportaltypes]
    };
};

const renderObjectId = (objectId: number): string => objectId.toString();

const renderOrganizationType = (organizationType: string) => {
    if (organizationType == null) {
        return '-';
    }

    return organizationType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const renderPhoneNumber = (phoneNumber: number): string => {
    if (phoneNumber == null) {
        return '-';
    }

    const PHONE_STR = phoneNumber.toString();
    const CLEAN_PHONE_STR = ('' + PHONE_STR).replace(/\D/g, '');
    const MATCH = CLEAN_PHONE_STR.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (MATCH) {
        return '(' + MATCH[1] + ') ' + MATCH[2] + '-' + MATCH[3];
    }

    return '-';
};

const renderTitle = (title: string): string => {
    if (title == null) {
        return '-';
    }

    return title;
};

const renderPGEPortalTypes = (pgeportaltypes: string): string => {
    if (pgeportaltypes == null) {
        return 'None';
    }

    return pgeportaltypes;
};


const renderDate = (milliseconds: number): string => {
    const DATE = new Date(milliseconds);
    return `${DATE.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`;
};

const renderTermsAndConditions = (termsAndConditions: string): JSX.Element => {
    switch (termsAndConditions) {
        case 'yes_i_agree_':
            return (
                <Tag color="green" className="Confirmed">
                    Confirmed
                </Tag>
            );

        case 'N/A':
            return (
                <Tag color="yellow" className="NA">
                    N/A
                </Tag>
            );
        default:
            return (
                <Tag color="red" className="Declined">
                    Declined
                </Tag>
            );
    }
};

const exportCSV = (requests: any[], filename: string): void => {
    const HIDDEN_ELEMENT = document.createElement('a');
    let csv =
        'ObjectID,GlobalID,First Name,Last Name,Title,Organization Name,Organization Type,Email,User Type,Phone Number,Request Date,Agree To Terms and Conditions\n';

    requests.forEach((request: any) => {
        console.log("request: ", request)
        csv += `"${request[objectid].toString()}",`;
        csv += `"${request[globalid]}",`;
        csv += `"${request[firstName]}",`;
        csv += `"${request[lastName]}",`;
        csv += `"${request[title]}",`;
        csv += `"${request[organizationName]}",`;
        csv += `"${renderOrganizationType(request[organizationType])}",`;
        csv += `"${request[email]}",`;
        csv += `"${renderPGEPortalTypes(request[pgeportaltypes])}",`;
        csv += `"${renderPhoneNumber(request[phoneNumber])}",`;
        csv += `"${renderDate(request[creationDate])}",`;
        csv += `"${renderTermsAndConditions(request[agreeToTermsAndConditions]).props.className}"\n`;
    });

    HIDDEN_ELEMENT.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    HIDDEN_ELEMENT.target = '_blank';
    HIDDEN_ELEMENT.download = `${filename}.csv`;
    HIDDEN_ELEMENT.click();
};

export {
    renderObjectId,
    renderOrganizationType,
    renderPhoneNumber,
    renderTitle,
    renderDate,
    renderTermsAndConditions,
    createEmailMessage,
    createInvitation,
    renderPGEPortalTypes,
    exportCSV,
};
