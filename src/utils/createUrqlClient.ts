import { dedupExchange, fetchExchange } from "urql";
import {
    LogoutMutation,
    MeQuery,
    MeDocument,
    LoginMutation,
    RegisterMutation,
} from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
        updates: {
            Mutation: {
            logout: (_result, args, cache, info) => {
                betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
                );
            },
            login: (_result, args, cache, info) => {
                // cache.updateQuery({query:MeDocument}, (data: MeQuery)=>{});
                betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                    if (result.login.errors) {
                    return query;
                    } else if (result.login.user) {
                    return {
                        me: result.login.user,
                    };
                    } else return query;
                }
                );
            },

            register: (_result, args, cache, info) => {
                betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                    if (result.register.errors) return query;
                    else if (result.register.user)
                    return { me: result.register.user };
                    else return query;
                }
                );
            },
            },
        },
        }),
        ssrExchange,
        fetchExchange,
    ],
    });
