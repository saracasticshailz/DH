// Function to extract file name from URL
export function getFileName(url: string) {
  // Match the file name including the extension (e.g., .pdf)
  const match = url.match(/\/([^/]+\.pdf)(?=\?)/);
  return match ? match[1] : null;
}

export function getGenderName(code: string) {
  switch (code) {
    case 'M':
      return 'Male';
    case 'F':
      return 'Female';
    default:
      return 'Not Selected';
  }
}

export function getCityOrCountryName(code: string) {
  switch (code) {
    case 'AE':
      return 'UAE';
    case 'IN':
      return 'INDIA';
    case 'AUH':
      return 'Abu Dhabi';
    case 'AJM':
      return 'Ajman';
    case 'DXB':
      return 'Dubai';
    case 'FUJ':
      return 'Fujairah';
    case 'RAK':
      return 'Ras Al khaimah';
    case 'SHJ':
      return 'Sharjah';
    case 'UAQ':
      return 'Umm Al Quwain';
    default:
      return 'Not Selected';
  }
}

export function getLableAndCheckValue(lable: string,value:string){
    if(lable === 'Gender'){
      return getGenderName(value);
    }else if(lable === 'Nationality'){
        return getCityOrCountryName(value);
    }else if(lable === 'Country of residence'){
        return getCityOrCountryName(value);
    }
    else{
        return value;
    }
}
