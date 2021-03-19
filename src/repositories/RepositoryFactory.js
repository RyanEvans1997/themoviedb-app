import GetRepository from './GetRepository';

const repositories = {
    'getRequests': GetRepository
}

export default {
    get: name => repositories[name]
};