// use MJ_ENV since we need the same env: local, dev, prod
// dev questionIds are unknown as they don't currently exist,
// it will probably be the same since they seed from the same set of data
const questionIdsSets = {
    local: {
        userApplication: {
            firstname: 53,
            lastname: 52,
            countryCode: 50,
            gender: 51,
        },
    },
    dev: {
        userApplication: {
            firstname: 53,
            lastname: 52,
            countryCode: 50,
            gender: 51,
        },
    },
};

const MJ_ENV = process.env.MJ_ENV === "local" ? "local" : "dev";
export const questionIds = questionIdsSets[MJ_ENV];
