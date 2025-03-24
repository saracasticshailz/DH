
interface MortgageDiscount {
    proprtyType: string;
    CustomerCategory: string;
    discountCode: string;
    journeyType: string;
  }

  interface MortgagePricing {
    proprtyType: string;
    CustomerCategory: string;
    applicationRefNumber: string;
    journeyType: string;
  }

  

  

  export  function generateJsonMortgageDiscount(MortgageDiscount: MortgageDiscount): object {
   
    const jsonObject  = {
      proprtyType: MortgageDiscount.propertyType,
      CustomerCategory: MortgageDiscount.propertyType,
      discountCode: MortgageDiscount.propertyType,
      journeyType: MortgageDiscount.propertyType,
      };
      return jsonObject;

}

export  function generateJsonMortgagePricing(MortgagePricing: MortgagePricing): object {
   
  const jsonObject  = {
    proprtyType: MortgagePricing.propertyType,
      CustomerCategory: MortgagePricing.propertyType,
      applicationRefNumber: MortgagePricing.propertyType,
      journeyType: MortgagePricing.propertyType,
    };
    return jsonObject;

}


