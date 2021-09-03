import { Box, Button, Link } from '@chakra-ui/react';
import { query } from '@urql/exchange-graphcache';
import { Form, Formik } from 'formik';
import {NextPage} from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import router from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import login from '../login';

const ChangePassword:NextPage<{token:string}> = ({token}) => {
    console.log(token);
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return(
        <Wrapper variant = 'small' >
            <Formik initialValues = {{newPassword : ''}} onSubmit={async (values, {setErrors}) => {
                const response = await changePassword({token:token, newPassword:values.newPassword});
                if( response.data?.changePassword.errors ) 
                {
                    const errorMap = toErrorMap(response.data.changePassword.errors);
                    if('token' in errorMap) setTokenError(errorMap.token);
                    setErrors(errorMap);
                }
                else if ( response.data?.changePassword.user) router.push('/');
            }} >
                {({isSubmitting})=> (
                    <Form>
                        <InputField type = 'password' autoComplete='off' name = 'newPassword' placeholder = 'Enter New Password' label = 'New Password' />
                        {tokenError && <Box><Box color = 'red' mt = {2}>{tokenError}</Box></Box>}
                        <Button colorScheme="teal" mt = {4} type = 'submit' isLoading = {isSubmitting}>Change Password</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

ChangePassword.getInitialProps = ({query}) => {
    return{
        token:query.token as const,
    }
}

export default withUrqlClient(createUrqlClient, {ssr:false})(ChangePassword);
