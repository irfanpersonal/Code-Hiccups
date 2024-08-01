const convertFormDataToObject = (formData: FormData) => {
    const object: any = {};
    formData.forEach((value, key) => {
        if (!key.startsWith("$") && !key.startsWith("~")) {
            if (object[key] === undefined) {
                object[key] = value;
            } 
            else {
                if (Array.isArray(object[key])) {
                    object[key].push(value);
                } 
                else {
                    object[key] = [object[key], value];
                }
            }
        }
    });
    return object;
}

export default convertFormDataToObject;
