
interface PersonalAccessDetails {
    propertyType: string;
    completionStatus: string;
    developmentProjectName: string;
    buildingName: string;
    locality: string;
    emirate: string;
    flatNumber: string;
    floorNumber: string;
    landmarks: string;
    contactName: string;
    email: string;
    mobileNumber: string |number;
    date: string |number;
    time: string |number;
    specialInstructions: string;
    alternateMobileNumber: string |number;
    bankReference: string;
    applicationReference: string;
  }

  interface OrderFetch {
    bankReferenceId: string;
  }
  
  interface ReviewOrderUpdate {
    leadRefNo: string;
    sourceRefNo: string;
    valuationOrderRefNo: string;
    paymentRefNo: string;
    orderRemarks: string;
    orderStatus: string;
    loanApplicationNo: string;
    rmCode: string;
    journeyType: string;
    creditVerificationConsentDateTime: string;
    privacyPolicyConsentDateTime: string;
    generalTermsConsentDateTime: string;
    cpsTermsConsentDateTime: string;
    kfsConsentDateTime: string;
    uaeFtsRequestConsentDateTime: string;
  }

export  function generateJsonOrder(personalAccessDetails: PersonalAccessDetails): object {
   
    const jsonObject  = {
        propertyType: personalAccessDetails.propertyType,
        transactionType: personalAccessDetails.completionStatus,
        projectName: personalAccessDetails.developmentProjectName,
        buildingName: personalAccessDetails.buildingName,
        localityArea: personalAccessDetails.locality,
        state : personalAccessDetails.emirate,
        houseNoFlatNo : personalAccessDetails.flatNumber,
        floor : personalAccessDetails.floorNumber,
        landmarks : personalAccessDetails.landmarks,
        contactPerson : personalAccessDetails.contactName,
        address : personalAccessDetails.email,
        contactNumber : personalAccessDetails.mobileNumber,
        preferredStartDateTimeFrom : `${personalAccessDetails.date} ${personalAccessDetails.time}`,
        preferredStartDateTimeTo : `${personalAccessDetails.date} ${personalAccessDetails.time}` ,
        specialInstruction : `${personalAccessDetails.specialInstructions},${personalAccessDetails.alternateMobileNumber}`,
        bankReference : personalAccessDetails.bankReference,
        applicationReference : personalAccessDetails.applicationReference
      };
      return jsonObject;

}

export  function generateJsonOrderFetch(OrderFetch: OrderFetch): object {
   
  const jsonObject  = {
           bankReference : OrderFetch.bankReference,
    };
    return jsonObject;

}

export  function generateJsonOrderUpdate(reviewOrderUpdate: ReviewOrderUpdate): object {
  
  const jsonObject  = {
    leadRefNo: reviewOrderUpdate.leadRefNo,
    sourceRefNo: reviewOrderUpdate.sourceRefNo,
    valuationOrderRefNo: reviewOrderUpdate.valuationOrderRefNo,
    paymentRefNo: reviewOrderUpdate.paymentRefNo,
    orderRemarks: "Customer Consent Recevied",
    orderStatus: "DU",
    loanApplicationNo : reviewOrderUpdate.loanApplicationNo,
    rmCode : reviewOrderUpdate.rmCode,
    journeyType : reviewOrderUpdate.journeyType,
    creditVerificationConsentDateTime : reviewOrderUpdate.creditVerificationConsentDateTime,
    privacyPolicyConsentDateTime : reviewOrderUpdate.privacyPolicyConsentDateTime,
    generalTermsConsentDateTime : reviewOrderUpdate.generalTermsConsentDateTime,
    cpsTermsConsentDateTime : reviewOrderUpdate.cpsTermsConsentDateTime,
    kfsConsentDateTime : reviewOrderUpdate.kfsConsentDateTime ,
    uaeFtsRequestConsentDateTime : reviewOrderUpdate.uaeFtsRequestConsentDateTime,
    };
    return jsonObject;

}