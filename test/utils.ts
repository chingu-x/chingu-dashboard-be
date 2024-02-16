// returns just the token
export const extractResCookieValueByKey = (cookies, key) => {
    return cookies
        .map((cookie) => {
            return cookie.split(";")[0].split("=");
        })
        .filter((cookie) => cookie[0] === key)[0][1];
};

// returns 'access_token={token}; Max-Age=1800; Path=/; Expires=Fri, 16 Feb 2024 03:17:25 GMT; HttpOnly; Secure'
export const extractCookieByKey = (cookie, key) => {
    return cookie.filter((cookie) => cookie.includes(key))[0];
};
