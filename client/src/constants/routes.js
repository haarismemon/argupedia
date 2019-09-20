export const HOME = '/';
export const SEARCH = '/search';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const ACCOUNT = '/account';
export const FORGOT_PASSWORD = '/forgot-password';
export const ARGUMENT_DETAILS = '/argument/:id';
export const SUBMIT_ARGUMENT = '/submit';

export const SERVER_API = `http://localhost:${process.env.PORT || 9000}`;
export const ARGUMENT_SINGLE = SERVER_API + '/api/argument';
export const ARGUMENT_LIST_TOP = SERVER_API + '/api/arguments/topDebates';
export const ARGUMENT_LIST_DESCENDENTS = SERVER_API + '/api/arguments/descendents';
export const ARGUMENT_LIST_NETWORK = SERVER_API + '/api/arguments/network';
export const ARGUMENT_LIST_SEARCH = SERVER_API + '/api/arguments/search';
export const ARGUMENT_LIST_USER_SUBMITTED = SERVER_API + '/api/arguments/userSubmittedArguments';