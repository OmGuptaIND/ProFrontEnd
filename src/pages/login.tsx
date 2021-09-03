import React from 'react';

import {Formik, Form} from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
interface loginProps{

}

const Login: React.FC<loginProps> = ({}) => {
    const [,login] = useLoginMutation();
    const router = useRouter();
    return(
        <Wrapper variant = 'small' >
            <Formik initialValues = {{usernameOrEmail: "", password: ""}} onSubmit={async (values, {setErrors}) => {
                const response = await login({usernameOrEmail: values.usernameOrEmail, password: values.password});
                if( response.data?.login.errors ) setErrors(toErrorMap(response.data.login.errors));
                else if ( response.data?.login.user) router.push('/');
            }} >
                {({isSubmitting})=> (
                    <Form>
                        <InputField autoComplete='off' name = 'usernameOrEmail' placeholder = 'username or email' label = 'username or email' />
                        <Box mt = {4} >
                            <InputField type = 'password' placeholder = 'password' name = 'password' label = 'Password' />
                        </Box>
                        <Flex mt = {2}>
                            <NextLink href = '/forgot-password' ><Link ml = 'auto'>Forgot Password ?.</Link></NextLink>
                        </Flex>
                        <Button colorScheme="teal" mt = {4} type = 'submit' isLoading = {isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};

export default withUrqlClient(createUrqlClient)(Login);