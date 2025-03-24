
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
        specialInstruction : `${personalAccessDetails.specialInstructions}|${personalAccessDetails.alternateMobileNumber}`,
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