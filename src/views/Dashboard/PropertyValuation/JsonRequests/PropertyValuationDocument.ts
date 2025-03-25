
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

  interface DocumentUpload {
    file: string;
    bankReferenceId: string | null;
  }

  

  export  function generateJsonDocumentFetch(documentFetch: DocumentFetch): object {
   
    const jsonObject  = {
        bankReferenceId: documentFetch.bankReferenceId,
      };
      return jsonObject;

}


export  function generateJsonDocumentUpload(documentUpload: DocumentUpload): object {
   
  const jsonObject  = {
      file: documentUpload.file,
      bankReferenceId: documentUpload.bankReferenceId,
    };
    return jsonObject;

}

export  function generateJsonDocumentList(documentList: DocumentList): object {
   
  const jsonObject  = {
    transactionTypeClientCode: documentList.transactionTypeClientCode,
    };
    return jsonObject;

}

export  function generateJsonDocumentRemove(documentRemove: DocumentRemove): object {
   
  const jsonObject  = {
    documentId: documentRemove.documentId,
    bankReferenceId: documentRemove.bankReferenceId,
    };
    return jsonObject;

}