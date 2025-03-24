
interface DocumentFetch {
    bankReferenceId: number | null;
  }

  interface DocumentList {
    transactionTypeClientCode: string;
  }

  interface DocumentRemove {
    documentId: string;
    bankReferenceId: number | null;
  }

  interface DocumentUpdate {
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

  export  function generateJsonDocumentFetch(DocumentFetch: DocumentFetch): object {
   
    const jsonObject  = {
        bankReferenceId: DocumentFetch.propertyType,
      };
      return jsonObject;

}

export  function generateJsonDocumentList(DocumentList: DocumentList): object {
   
  const jsonObject  = {
    transactionTypeClientCode: DocumentList.propertyType,
    };
    return jsonObject;

}

export  function generateJsonDocumentRemove(DocumentRemove: DocumentRemove): object {
   
  const jsonObject  = {
    documentId: DocumentRemove.propertyType,
    bankReferenceId: DocumentRemove.propertyType,
    };
    return jsonObject;

}
  

export  function generateJsonDocumentUpdate(DocumentUpdate: DocumentUpdate): object {
   
    const jsonObject  = {
        leadRefNo: DocumentUpdate.propertyType,
        sourceRefNo: DocumentUpdate.completionStatus,
        valuationOrderRefNo: DocumentUpdate.developmentProjectName,
        paymentRefNo: DocumentUpdate.buildingName,
        orderRemarks: "Customer Consent Recevied",
        orderStatus: "DU",
        loanApplicationNo : DocumentUpdate.emirate,
        rmCode : DocumentUpdate.flatNumber,
        journeyType : DocumentUpdate.floorNumber,
        creditVerificationConsentDateTime : DocumentUpdate.landmarks,
        privacyPolicyConsentDateTime : DocumentUpdate.contactName,
        generalTermsConsentDateTime : DocumentUpdate.email,
        cpsTermsConsentDateTime : DocumentUpdate.mobileNumber,
        kfsConsentDateTime : `${DocumentUpdate.date} ${DocumentUpdate.time}`,
        uaeFtsRequestConsentDateTime : `${DocumentUpdate.date} ${DocumentUpdate.time}` ,
      };
      return jsonObject;

}