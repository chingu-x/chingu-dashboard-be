export const extractResCookieValueByKey = (cookies, key) => {
    return cookies
        .map((cookie) => {
            return cookie.split(";")[0].split("=");
        })
        .filter((cookie) => cookie[0] === key)[0][1];
};
