class APIError { 
     header: string;
     message: string;

     constructor(header: string, message: string) { 
         this.header = header;
         this.message = message;
     } 
}

export default APIError;