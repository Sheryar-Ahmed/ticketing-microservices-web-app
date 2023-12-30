import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            onSuccess();
            return response.data;
        } catch (error) {
            setErrors(error.response.data.message);
        }
    }

    return [doRequest, errors]
}

export default useRequest;
