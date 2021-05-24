import each from 'jest-each';
import {
    renderObjectId,
    renderTitle,
    renderTermsAndConditions,
    renderDate,
    renderPhoneNumber,
    renderOrganizationType,
    renderPGEPortalTypes,
    createEmailMessage,
    createInvitation,
} from './utils';
import { Invitation } from '../types/types';

describe('renderTitle', () => {
    each([
        ['-', null],
        ['title', 'title'],
    ]).test('Returns %s', (expected: string, title: string) => {
        expect(renderTitle(title)).toBe(expected);
    });
});

describe('renderTermsAndConditions', () => {
    each([
        ['red', 'declined'],
        ['green', 'yes_i_agree_'],
        ['yellow', 'N/A'],
    ]).test('Returns %s', (expected: string, title: string) => {
        expect(renderTermsAndConditions(title).props.color).toBe(expected);
    });
});

describe('renderPGEPortalTypes', () => {
    each([
        ['PSPS_Portal_only', 'PSPS_Portal_only'],
        ['Microgrid_Portal_only', 'Microgrid_Portal_only'],
        ['Both_PG&E_PortalsG', 'Both_PG&E_Portals'],
        ['Option_not_selected', 'Option_not_selected'],
    ]).test('Returns %s', (expected: string, pgeportaltypes: string) => {
        expect(renderPGEPortalTypes(pgeportaltypes)).toBe(expected);
    });
});

describe('renderDate', () => {
    each([['string', 1000000]]).test('Returns %s', (expected: string, milliseconds: number) => {
        expect(typeof renderDate(milliseconds)).toBe(expected);
    });
});

describe('renderPhoneNumber', () => {
    each([
        ['string', 1234567890],
        ['string', 12345678901],
        ['string', null],
    ]).test('Returns %s', (expected: string, phoneNumber: number) => {
        expect(typeof renderPhoneNumber(phoneNumber)).toBe(expected);
    });
});

describe('renderOrganizationType', () => {
    each([
        ['string', ''],
        ['string', null],
    ]).test('Returns %s', (expected: string, organizationType: string) => {
        expect(typeof renderOrganizationType(organizationType)).toBe(expected);
    });
});

describe('renderObjectId', () => {
    each([['string', 1000000]]).test('Returns %s', (expected: string, objectid: number) => {
        expect(typeof renderObjectId(objectid)).toBe(expected);
    });
});

describe('createEmailMessage', () => {
    each([
        [
            'string',
            {
                email: 'string',
                firstname: 'string',
                lastname: 'string',
                username: 'string',
                password: 'string',
                role: 'string',
                userLicenseType: 'string',
                fullname: 'string',
                userType: 'string',
                groups: 'string',
                userCreditAssignment: -1,
                applyActUserDefaults: true,
            },
        ],
    ]).test('Returns %s', (expected: string, invitation: Invitation) => {
        expect(typeof createEmailMessage(invitation)).toBe(expected);
    });
});
describe('createInvitation', () => {
    each([
        [
            'object',
            {
                email: 'string',
                firstname: 'string',
                lastname: 'string',
            },
        ],
    ]).test('Returns %s', (expected: string, invitation: any) => {
        expect(typeof createInvitation(invitation)).toBe(expected);
    });
});
