import { Session } from 'ch-node-session-handler';
import {SessionKey} from 'ch-node-session-handler/lib/session/keys/SessionKey';
import { Request } from 'express';
import {SuppressionData, SUPPRESSION_DATA_KEY} from '../../../src/models/SuppressionDataModel';
import SessionService from '../../../src/services/session/SessionService';

const mockSuppressionData: SuppressionData = {
  applicantDetails: {
    fullName: 'test-name',
    emailAddress: 'test-email',
    dateOfBirth: '1980-01-05'
  },
  addressToRemove: {
    line1: '1 Test Street',
    line2: '',
    town: 'Test Town',
    county: 'Test Midlands',
    postcode: 'TE10 6ST',
    country: 'United Kingdom'
  },
  serviceAddress: {
    line1: '2 New Street',
    line2: '',
    town: 'A Town',
    county: 'Mid Lands',
    postcode: 'AB33 2RR',
    country: 'UK'
  },
  documentDetails: {
    companyName: 'company-name-test',
    companyNumber: 'NI000000',
    description: 'This is a document',
    date: '2020-01-01'
  },
  contactAddress: {
    line1: '3 Test Street',
    line2: '',
    town: 'Test life',
    county: 'Test bands',
    postcode: 'A23 4567',
    country: 'USA'
  },
  applicationReference: '123',
  paymentStateUUID: '1'
};

const mockRequestData = {
  session: {
    getExtraData: jest.fn() as any
  } as Session
} as Request;

describe('SessionService', () => {

  it('should retrieve suppression data from the session', () => {

    const mockRequest: Request = mockRequestData;

    const mockGetExtraData = jest.fn().mockReturnValue(mockSuppressionData);
    mockRequest.session!.getExtraData = mockGetExtraData;

    expect(SessionService.getSuppressionSession(mockRequest)).toEqual(mockSuppressionData);
    expect(mockGetExtraData).toHaveBeenCalledWith(SUPPRESSION_DATA_KEY);
  });

  it('should return undefined when no suppression data exists in the session', () => {

    const mockRequest: Request = mockRequestData;

    const mockGetExtraData: jest.Mock = jest.fn().mockReturnValue(undefined);
    mockRequest.session!.getExtraData = mockGetExtraData;

    expect(SessionService.getSuppressionSession(mockRequest)).toBeUndefined();
    expect(mockGetExtraData).toHaveBeenCalledWith(SUPPRESSION_DATA_KEY);
  });

  it('should set the suppression data in the session', () => {

    const mockRequest: Request = mockRequestData;

    const mockSetExtraData: jest.Mock = jest.fn();
    mockRequest.session!.setExtraData = mockSetExtraData;

    SessionService.setSuppressionSession(mockRequest, mockSuppressionData);

    expect(mockSetExtraData).toHaveBeenCalledWith(SUPPRESSION_DATA_KEY, mockSuppressionData);
  })


  it('should retrieve the access token from the session', () => {

    const testToken = 'test-token';
    const mockRequest: Request = mockRequestData;

    const mockGetSignInInfo: jest.Mock = jest.fn(() => {
      return {
        access_token: {
          access_token: testToken
        },
        user_profile: {
          email: 'test@example.com'
        }
      }
    });
    mockRequest.session!.get = mockGetSignInInfo;

    const result = SessionService.getAccessToken(mockRequest);
    expect(result).toEqual(testToken);
    expect(mockGetSignInInfo).toHaveBeenCalledWith(SessionKey.SignInInfo);
  })

});
