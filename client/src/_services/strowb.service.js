import { fetchWrapper } from '@/_helpers';
import config from 'config';

const baseUrl = `${config.apiUrl}/strowbs`;

export const strowbService = {
    createStrowb
};

function createStrowb(params) {
    return fetchWrapper.post(`${baseUrl}/create`, params);
}